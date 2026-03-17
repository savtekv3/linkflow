const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    try {
        // Create a connection without database selected to create the database if it doesn't exist
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log(`Creating database ${process.env.DB_NAME} if not exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        
        await connection.end();

        // Connect to the specific database
        const pool = require('./src/config/database');
        
        console.log('Creating users table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(191) NOT NULL UNIQUE,
                plan VARCHAR(50) DEFAULT 'Free',
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Creating links table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS links (
                id_link INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                url VARCHAR(2048) NOT NULL,
                status VARCHAR(50) DEFAULT 'Active',
                when_to_check INT NOT NULL,
                last_checked DATETIME,
                next_check DATETIME,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Database and tables initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
