const pool = require('../config/database');

exports.getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Verify premium status
        const [[user]] = await pool.query('SELECT plan FROM users WHERE id = ?', [userId]);
        if (!user || user.plan === 'Free') {
            return res.status(403).json({ 
                error: 'Upgrade your plan to pro/Elite for analytics!',
                isPremium: false 
            });
        }

        // 1. Total Links
        const [[{ totalLinks }]] = await pool.query('SELECT COUNT(*) as totalLinks FROM links WHERE user_id = ?', [userId]);

        // 2. Total Clicks
        const [[{ totalClicks }]] = await pool.query(`
            SELECT COUNT(c.id) as totalClicks
            FROM link_clicks c
            JOIN links l ON c.link_id = l.id_link
            WHERE l.user_id = ?
        `, [userId]);

        // 3. Top Link
        const [topLinks] = await pool.query(`
            SELECT l.name, l.short_code, l.url, COUNT(c.id) as clicks
            FROM links l
            LEFT JOIN link_clicks c ON l.id_link = c.link_id
            WHERE l.user_id = ?
            GROUP BY l.id_link
            ORDER BY clicks DESC
            LIMIT 1
        `, [userId]);
        const topLink = topLinks.length > 0 ? topLinks[0] : null;

        // 4. Clicks by Date (last 14 days)
        const [clicksByDate] = await pool.query(`
            SELECT DATE(c.created_at) as date_val, COUNT(c.id) as count
            FROM link_clicks c
            JOIN links l ON c.link_id = l.id_link
            WHERE l.user_id = ? AND c.created_at >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
            GROUP BY DATE(c.created_at)
            ORDER BY date_val ASC
        `, [userId]);

        // 5. Clicks by Country
        const [clicksByCountry] = await pool.query(`
            SELECT IFNULL(c.country, 'Unknown') as country, COUNT(c.id) as count
            FROM link_clicks c
            JOIN links l ON c.link_id = l.id_link
            WHERE l.user_id = ?
            GROUP BY country
            ORDER BY count DESC
            LIMIT 5
        `, [userId]);

        // 6. Clicks by Device
        const [clicksByDevice] = await pool.query(`
            SELECT IFNULL(c.device_type, 'Unknown') as device_type, COUNT(c.id) as count
            FROM link_clicks c
            JOIN links l ON c.link_id = l.id_link
            WHERE l.user_id = ?
            GROUP BY device_type
            ORDER BY count DESC
        `, [userId]);

        res.json({
            totalLinks,
            totalClicks,
            topLink,
            clicksByDate,
            clicksByCountry,
            clicksByDevice
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
