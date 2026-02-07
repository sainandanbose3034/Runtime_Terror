const express = require('express');
const router = express.Router();
const asteroidController = require('../controllers/asteroidController');
const verifyToken = require('../middleware/auth');

// Public Feed and Lookup
router.get('/feed', asteroidController.getFeed);
router.get('/lookup/:id', asteroidController.getAsteroid);

// User Watchlist (Protected)
router.get('/watchlist', verifyToken, asteroidController.getWatchlist);
router.post('/watchlist', verifyToken, asteroidController.addToWatchlist);
router.delete('/watchlist/:asteroidId', verifyToken, asteroidController.removeFromWatchlist);

module.exports = router;
