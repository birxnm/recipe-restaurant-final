const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const sendEmail = require('../utils/sendEmail');

const registerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin', 'premium', 'moderator'),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

exports.register = async (req, res, next) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        await user.save();

        // Send Welcome Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Welcome to Asian Food Explorer!',
                message: `Hello ${user.username},\n\nWelcome to our platform! Start exploring delicious Asian recipes today.\n\nBest regards,\nThe Asian Food Explorer Team`
            });
        } catch (err) {
            console.error('Email could not be sent', err);
            // We don't want to stop registration if email fails, just log it
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                profileImage: user.profileImage
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                profileImage: user.profileImage
            },
        });
    } catch (err) {
        next(err);
    }
};
