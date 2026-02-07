const cron = require('node-cron');
const User = require('../models/User');
const Notification = require('../models/Notification');
const nasaService = require('../services/nasaService');
const riskAnalysis = require('../services/riskAnalysis');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily asteroid risk check...');

    try {
        const today = new Date().toISOString().split('T')[0];
        const data = await nasaService.getFeed(today, today);
        const nearbyAsteroids = data.near_earth_objects[today] || [];

        // Get all users with watchlists
        const users = await User.find({ 'watchlist.0': { $exists: true } });

        for (const user of users) {
            for (const watchedItem of user.watchlist) {
                // Check if watched asteroid is in today's feed
                const asteroid = nearbyAsteroids.find(a => a.id === watchedItem.asteroidId);

                if (asteroid) {
                    const risk = riskAnalysis.analyzeRisk(asteroid);

                    // Alert if risk is high or matches user preference
                    if (risk.level === 'HIGH' || risk.level === 'EXTREME' || risk.level === user.alerts.riskThreshold || 'LOW' === 'LOW') { // Simplified check
                        // Create notification
                        await Notification.create({
                            userId: user._id,
                            type: 'CLOSE_APPROACH',
                            message: `Asteroid ${asteroid.name} is approaching today! Risk Level: ${risk.level}`,
                            asteroidId: asteroid.id,
                            riskLevel: risk.level
                        });
                        console.log(`Alert created for user ${user.email} re: ${asteroid.name}`);
                    }
                }
            }
        }
        console.log('Daily check completed.');

    } catch (error) {
        console.error('Error in daily scheduler:', error);
    }
});
