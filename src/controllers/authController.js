const User = require('../models/User');

// Create or update user profile after Firebase login
exports.syncUser = async (req, res) => {
    try {
        const { uid, email, name } = req.user; // From firebase middleware

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            // Create new user in our DB
            user = new User({
                firebaseUid: uid,
                email: email,
                name: name || req.body.name || 'Anonymous'
            });
            await user.save();
            return res.status(201).json({ message: 'User created', user });
        } else {
            // Update existing user info if needed
            if (req.body.name) user.name = req.body.name;
            await user.save();
            return res.status(200).json({ message: 'User synced', user });
        }

    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server error syncing user data' });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
