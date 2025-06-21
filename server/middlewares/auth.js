const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ message: 'Access denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findByPk(decoded.id);
		req.userId = decoded.id; // Add userId for easy access
		next();
	} catch (error) {
		res.status(400).json({ message: 'Invalid token.' });
	}
};

// Export both formats
module.exports = authMiddleware;
module.exports.authenticate = authMiddleware;