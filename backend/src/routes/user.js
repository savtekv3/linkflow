const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All user routes are protected by authMiddleware
router.use(authMiddleware);

// Get current user data
router.get('/', userController.getUser);

// Update user email
router.put('/email', userController.updateEmail);

// Update user password
router.put('/password', userController.updatePassword);

// Update user plan
router.put('/plan', userController.updatePlan);

// Delete user account
router.delete('/', userController.deleteAccount);

module.exports = router;
