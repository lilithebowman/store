const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user
exports.createUser = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		await newUser.save();
		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error creating user', error });
	}
};

// Get all users
exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}, '-password'); // Exclude password field
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error });
	}
};

// Get user by ID
exports.getUserById = async (req, res) => {
	const { id } = req.params;

	try {
        const user = await User.findByPk(id);
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

		const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: 'Error updating user', error });
	}
};

// Delete user
exports.deleteUser = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedUser = await User.findByIdAndDelete(id);
		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting user', error });
	}
};