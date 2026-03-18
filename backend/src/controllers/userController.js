const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await pool.query('SELECT id, name, email, plan, created_at FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Check if the new email is already used by another user
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        await pool.query('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
        res.json({ message: 'Email updated successfully', user: { email } });
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Retrieve current hashed password
        const [users] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = users[0];

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update database
        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, userId]);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        // Due to "ON DELETE CASCADE" in DB init, links should also be deleted
        await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
