const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const linkRoutes = require('./src/routes/links');
const redirectRoutes = require('./src/routes/redirect');
const { startLinkChecker } = require('./src/services/linkChecker');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/links', linkRoutes);
app.use('/r', redirectRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'LinkTrack API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Start background link polling job
    startLinkChecker();
});
