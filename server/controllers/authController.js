const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        console.log('Registration request received:', { username, email, password: '***' });

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Check if this is the first user (make them admin)
        const userCount = await User.count();
        const isFirstUser = userCount === 0;

        // Create new user
        const user = await User.create({
            username,
            email,
            password, // Password will be hashed by the beforeCreate hook
            isAdmin: isFirstUser
        });

        if (isFirstUser) {
            console.log('First user created as admin:', email);
        }

        // Ensure JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        console.log('Registration successful for user:', email);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login request received:', { email, password: '***' });

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({
            where: { email: email }  // Fixed: properly specify the where clause
        });

        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        console.log('Login successful for user:', email);

        // Return user data along with token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
};

// Middleware to authenticate user
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id;
        next();
    });
};

// OAuth callback handler
exports.oauthCallback = (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
            profileImage: user.profileImage
        }
    });
};

// Logout handler
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};

// Update profile image
exports.updateProfileImage = async (req, res) => {
    const { profileImage } = req.body;
    const userId = req.userId; // From auth middleware

    try {
        if (!profileImage) {
            return res.status(400).json({ message: 'Profile image URL is required' });
        }

        // Update user profile image
        const [updated] = await User.update(
            { profileImage },
            { where: { id: userId } }
        );

        if (updated === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get updated user data
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            message: 'Profile image updated successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                profileImage: user.profileImage,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile image update error:', error);
        res.status(500).json({
            message: 'Error updating profile image',
            error: error.message
        });
    }
};