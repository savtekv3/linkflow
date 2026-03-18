const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const http = require('http'); // For a simple external IP lookup if needed

// Helper to determine device type
function getDeviceType(userAgent) {
    if (!userAgent) return 'Desktop';
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent) ? 'Mobile' : 'Desktop';
}

// Redirect and Track Click
router.get('/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;

        // Find the link original URL
        const [links] = await pool.query('SELECT id_link, url FROM links WHERE short_code = ?', [shortCode]);
        if (links.length === 0) {
            return res.status(404).send('Tracked link not found');
        }

        const link = links[0];
        const userAgent = req.headers['user-agent'];
        const deviceType = getDeviceType(userAgent);

        // Get IP and normalize it (remove IPv6 prefix if present)
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        if (ip.includes(',')) ip = ip.split(',')[0];
        ip = ip.replace(/^.*:/, ''); // Strip IPv6 prefix like ::ffff:
        if (ip === '1' || ip === '::1') ip = '127.0.0.1';

        // Perform a simple mock or quick geolocation lookup
        // Doing a quick HTTP GET to a free JSON geo API
        let country = 'Unknown';
        
        // If it's a localhost IP, we mock it. Otherwise fetch country.
        if (ip === '127.0.0.1' || ip.startsWith('192.168.')) {
            country = 'Local';
            await insertClickAndRedirect(link, deviceType, country, res);
        } else {
            http.get(`http://ip-api.com/json/${ip}`, (apiRes) => {
                let data = '';
                apiRes.on('data', chunk => data += chunk);
                apiRes.on('end', async () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.status === 'success') {
                            country = parsed.country;
                        }
                    } catch (e) {
                        console.error('IP API parsing error:', e);
                    }
                    await insertClickAndRedirect(link, deviceType, country, res);
                });
            }).on('error', async (err) => {
                console.error('Geolocate error:', err);
                await insertClickAndRedirect(link, deviceType, country, res);
            });
        }

    } catch (error) {
        console.error('Redirect Error:', error);
        res.status(500).send('Internal server error');
    }
});

async function insertClickAndRedirect(link, deviceType, country, res) {
    try {
        await pool.query(
            'INSERT INTO link_clicks (link_id, device_type, country) VALUES (?, ?, ?)',
            [link.id_link, deviceType, country]
        );
    } catch (err) {
        console.error('Error logging click:', err);
    }
    // Redirect regardless of logging success
    res.redirect(302, link.url);
}

module.exports = router;
