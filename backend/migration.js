const pool = require('./src/config/database');

async function runMigration() {
    try {
        console.log('Running database migrations...');
        
        // Add name and short_code to links, ignore error if they exist
        try {
            await pool.query('ALTER TABLE links ADD COLUMN name VARCHAR(255) AFTER id_link');
            console.log('Added name column to links table');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding name column:', e.message);
        }

        try {
            await pool.query('ALTER TABLE links ADD COLUMN short_code VARCHAR(50) UNIQUE AFTER name');
            console.log('Added short_code column to links table');
        } catch (e) {
            if (e.code !== 'ER_DUP_FIELDNAME') console.error('Error adding short_code column:', e.message);
        }

        // Create link_clicks table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS link_clicks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                link_id INT NOT NULL,
                device_type VARCHAR(50),
                country VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (link_id) REFERENCES links(id_link) ON DELETE CASCADE
            )
        `);
        console.log('Created link_clicks table');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
