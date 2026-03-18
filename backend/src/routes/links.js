const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// All link routes are protected by authMiddleware
router.use(authMiddleware);

// Analytics Route - MUST BE BEFORE /:id ROUTE
router.get('/analytics', analyticsController.getDashboardAnalytics);

// CRUD Routes
router.get('/', linkController.getLinks);
router.post('/', linkController.addLink);
router.delete('/:id', linkController.deleteLink);

module.exports = router;
