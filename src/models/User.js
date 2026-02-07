const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    watchlist: [{
        asteroidId: {
            type: String,
            required: true
        },
        name: String,
        addedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],
    alerts: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: true
        },
        riskThreshold: { // Minimum risk level to trigger alert
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'],
            default: 'MEDIUM'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
