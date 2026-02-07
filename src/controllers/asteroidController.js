const nasaService = require('../services/nasaService');
const riskAnalysis = require('../services/riskAnalysis');
const User = require('../models/User');

exports.getFeed = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        // Default to today if no dates
        const today = new Date().toISOString().split('T')[0];
        const sDate = start_date || today;
        const eDate = end_date || today;

        const data = await nasaService.getFeed(sDate, eDate);

        res.json(data);
    } catch (error) {
        console.error("Feed Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAsteroid = async (req, res) => {
    try {
        const { id } = req.params;
        const asteroid = await nasaService.getAsteroidById(id);
        const risk = riskAnalysis.analyzeRisk(asteroid);
        res.json({ ...asteroid, risk_analysis: risk });
    } catch (error) {
        res.status(404).json({ message: 'Asteroid not found' });
    }
};

exports.addToWatchlist = async (req, res) => {
    try {
        const { asteroidId, name, notes } = req.body;
        console.log("Adding to watchlist:", req.body);
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already in watchlist
        const exists = user.watchlist.some(item => item.asteroidId === asteroidId);
        if (exists) {
            return res.status(400).json({ message: 'Asteroid already in watchlist' });
        }

        user.watchlist.push({ asteroidId, name, notes });
        await user.save();
        res.status(200).json({ message: 'Added to watchlist', watchlist: user.watchlist });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding to watchlist' });
    }
};

exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const watchlistPromises = user.watchlist.map(async (item) => {
            try {
                const asteroid = await nasaService.getAsteroidById(item.asteroidId);
                const risk = riskAnalysis.analyzeRisk(asteroid);
                console.log(`Asteroid ${item.asteroidId}: Risk ${risk.score}, Safety ${100 - risk.score}`);
                return {
                    ...asteroid,
                    risk_analysis: risk,
                    safety_score: 100 - risk.score, // Calculated for frontend compatibility
                    // Watchlist specific fields
                    saved_notes: item.notes,
                    added_at: item.addedAt,
                    watchlist_id: item._id
                };
            } catch (error) {
                console.error(`Failed to fetch watchlist item ${item.asteroidId}:`, error.message);
                return null; // Skip invalid/expired asteroids
            }
        });

        const results = await Promise.all(watchlistPromises);
        const validResults = results.filter(item => item !== null);

        res.json({ watchlist: validResults });
    } catch (error) {
        console.error("Watchlist Fetch Error:", error);
        res.status(500).json({ message: 'Server error fetching watchlist' });
    }
};

exports.removeFromWatchlist = async (req, res) => {
    try {
        const { asteroidId } = req.params;
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.watchlist = user.watchlist.filter(item => item.asteroidId !== asteroidId);
        await user.save();
        res.status(200).json({ message: 'Removed from watchlist', watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: 'Server error removing to watchlist' });
    }
};
