const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User'); // Adjust the path as necessary
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
router.post('/register', authController.register);

// User login - Remove passport middleware for basic auth
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		// Log the received data (for debugging)
		console.log('Login request received:', { email, password: '***' });

		// Validate input
		if (!email || !password) {
			return res.status(400).json({
				message: 'Email and password are required'
			});
		}

		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({
				message: 'Invalid credentials'
			});
		}

		// Check password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({
				message: 'Invalid credentials'
			});
		}

		// Generate JWT token
		const token = jwt.sign(
			{
				id: user._id,
				email: user.email,
				username: user.username
			},
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		// Return user data and token (exclude password)
		const userData = {
			id: user._id,
			username: user.username,
			email: user.email,
			createdAt: user.createdAt
		};

		console.log('Login successful for:', email);

		// This is the critical part - make sure you're sending the response
		res.status(200).json({
			message: 'Login successful',
			token,
			user: userData
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({
			message: 'Server error during login'
		});
	}
});

// OAuth routes
router.get('/oauth/:provider', passport.authenticate('oauth2', { session: false }));

router.get('/oauth/:provider/callback', passport.authenticate('oauth2', { session: false }), authController.oauthCallback);

// Logout
router.post('/logout', authController.logout);

module.exports = router;