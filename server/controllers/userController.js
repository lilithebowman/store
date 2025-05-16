const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user
exports.createUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		// Use Sequelize create method instead of new User + save
		await User.create({
			username,
			email,
			password // Password will be hashed by the beforeCreate hook
		});

		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error });
	}
};

// Get all users
exports.getAllUsers = async (req, res) => {
	try {
		// Use findAll instead of find
		const users = await User.findAll({
			attributes: { exclude: ['password'] } // Exclude password field
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error });
	}
};

// Get user by ID
exports.getUserById = async (req, res) => {
	const { id } = req.params;

	try {
		// findByPk is already Sequelize
		const user = await User.findByPk(id, {
			attributes: { exclude: ['password'] }
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching user', error });
	}
};

// Update user
exports.updateUser = async (req, res) => {
	const { id } = req.params;
	const { username, email, password } = req.body;

	try {
		const updatedData = { username, email };
		if (password) {
			updatedData.password = await bcrypt.hash(password, 10);
		}

		// Replace findByIdAndUpdate with update + findByPk
		const [updated] = await User.update(updatedData, {
			where: { id }
		});

		if (updated === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		const updatedUser = await User.findByPk(id, {
			attributes: { exclude: ['password'] }
		});

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error });
	}
};

// Delete user
exports.deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		// Replace findByIdAndDelete with destroy
		const deleted = await User.destroy({
			where: { id }
		});

		if (deleted === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting user', error });
	}
};