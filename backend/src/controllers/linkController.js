const pool = require('../config/database');

exports.getLinks = async (req, res) => {
    try {
        const userId = req.user.id;
        const [links] = await pool.query(`
            SELECT l.*, COUNT(c.id) as clicks 
            FROM links l
            LEFT JOIN link_clicks c ON l.id_link = c.link_id
            WHERE l.user_id = ?
            GROUP BY l.id_link
            ORDER BY l.created_at DESC
        `, [userId]);
        
        // Remove dummy data, send actual clicks
        res.json({ links });
    } catch (error) {
        console.error('Error fetching links:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, url, when_to_check } = req.body;

        if (!name || !url || !when_to_check) {
            return res.status(400).json({ error: 'Name, URL, and check interval are required' });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (_) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Generate a simple 6-character shortcode
        const short_code = Math.random().toString(36).substring(2, 8);

        // Insert new link with next_check set to NOW() for immediate check
        const [result] = await pool.query(
            'INSERT INTO links (user_id, name, short_code, url, when_to_check, next_check, status) VALUES (?, ?, ?, ?, ?, NOW(), "Pending")',
            [userId, name, short_code, url, when_to_check]
        );

        res.status(201).json({ message: 'Link added successfully', linkId: result.insertId });
    } catch (error) {
        console.error('Error adding link:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const linkId = req.params.id;

        const [result] = await pool.query('DELETE FROM links WHERE id_link = ? AND user_id = ?', [linkId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Link not found or unauthorized' });
        }

        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
