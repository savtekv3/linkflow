const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.warn(`Database '${process.env.DB_NAME}' not found. Please run the init-db script.`);
        } else {
            console.error('Error connecting to database:', err.message);
        }
    });

module.exports = pool;
