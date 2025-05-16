const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Use create instead of new + save
		await User.create({
			username,
			email,
			password // Password will be hashed by the beforeCreate hook
		});

		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error registering user', error });
	}
};

// Login user
exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// Use findOne with where clause
		const user = await User.findOne({
			where: { email }
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Use the instance method defined in the User model
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: 'Error logging in', error });
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
	// Get the user info from the OAuth provider
	const user = req.user;

	// Check if user exists
	if (!user) {
		return res.status(401).json({ message: 'Authentication failed' });
	}

	// Generate JWT token for the authenticated user
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

	// Redirect or respond with the token
	res.status(200).json({
		token,
		user: {
			id: user.id,
			email: user.email,
			username: user.username
		}
	});
};

// Logout handler
exports.logout = (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).json({
				message: 'Error logging out',
				error: err.message || err
			});
		}
		res.status(200).json({ message: 'Logged out successfully' });
	});
};