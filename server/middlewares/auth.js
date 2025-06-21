const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	console.log('Auth middleware - Authorization header:', req.header('Authorization'));
	console.log('Auth middleware - Extracted token:', token);

	if (!token) {
		console.log('Auth middleware - No token provided');
		return res.status(401).json({ message: 'Access denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log('Auth middleware - Token decoded successfully:', decoded);
		req.user = await User.findByPk(decoded.id);
		req.userId = decoded.id; // Add userId for easy access
		console.log('Auth middleware - User found:', req.user ? req.user.id : 'null');
		next();
	} catch (error) {
		console.log('Auth middleware - Token verification failed:', error.message);
		res.status(400).json({ message: 'Invalid token.' });
	}
};

// Export both formats
module.exports = authMiddleware;
module.exports.authenticate = authMiddleware;