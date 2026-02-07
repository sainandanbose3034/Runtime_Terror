const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

// Protected route to sync user data after Firebase login
router.post('/sync', verifyToken, authController.syncUser);

// Protected route to get user profile
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
