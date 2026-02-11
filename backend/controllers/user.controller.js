const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { username, email, bio, profileImage } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username) user.username = username;
        if (email) user.email = email;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) user.profileImage = profileImage;

        await user.save();
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            bio: user.bio,
            profileImage: user.profileImage
        });
    } catch (err) {
        next(err);
    }
};
