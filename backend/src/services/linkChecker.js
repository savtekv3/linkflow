const cron = require('node-cron');
const pool = require('../config/database');
const https = require('https');
const http = require('http');

function checkUrl(url) {
    return new Promise(async (resolve) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            
            const res = await fetch(url, { 
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (res.ok || (res.status >= 200 && res.status < 400)) {
                resolve('Active');
            } else {
                resolve('Error');
            }
        } catch (err) {
            resolve('Error');
        }
    });
}

function startLinkChecker() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            console.log(`[cron] Checking links at ${new Date().toISOString()}`);

            // Find links that need to be checked
            const [links] = await pool.query('SELECT id_link, url, when_to_check FROM links WHERE next_check <= NOW() OR next_check IS NULL');

            if (links.length > 0) {
                console.log(`[cron] Found ${links.length} links to process.`);

                for (const link of links) {
                    const status = await checkUrl(link.url);
                    console.log(`[cron] Checked ${link.url} - Status: ${status}`);

                    // Update DB with result and schedule next check
                    await pool.query(
                        'UPDATE links SET status = ?, last_checked = NOW(), next_check = DATE_ADD(NOW(), INTERVAL ? MINUTE) WHERE id_link = ?',
                        [status, link.when_to_check, link.id_link]
                    );
                }
            }
        } catch (error) {
            console.error('[cron] Error in background link checker:', error);
        }
    });
    console.log('Background link checker started.');
}

module.exports = { startLinkChecker };
