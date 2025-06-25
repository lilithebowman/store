// Middleware to check if user has specific permission
const requirePermission = (permission) => {
	return async (req, res, next) => {
		try {
			// Ensure user is authenticated
			if (!req.user) {
				return res.status(401).json({ message: 'Authentication required' });
			}

			// Check if user has the required permission
			const hasPermission = await req.user.hasPermission(permission);
			if (!hasPermission) {
				return res.status(403).json({
					message: `Access denied. Required permission: ${permission}`
				});
			}

			next();
		} catch (error) {
			console.error('Permission check error:', error);
			return res.status(500).json({ message: 'Permission check failed' });
		}
	};
};

// Middleware to check if user is admin (backward compatibility)
const requireAdmin = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Authentication required' });
		}

		if (!req.user.isAdmin) {
			return res.status(403).json({ message: 'Admin access required' });
		}

		next();
	} catch (error) {
		console.error('Admin check error:', error);
		return res.status(500).json({ message: 'Admin check failed' });
	}
};

module.exports = {
	requirePermission,
	requireAdmin
};
