const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['RISK_ALERT', 'CLOSE_APPROACH', 'SYSTEM'],
        default: 'SYSTEM'
    },
    message: {
        type: String,
        required: true
    },
    asteroidId: String,
    riskLevel: String,
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
