/**
 * Example: Updated User Controller using Database Abstraction Layer
 * Shows how to migrate from Sequelize-specific code to database-agnostic code
 */

const { databaseManager, getModel } = require('../config/database');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// Example of using the abstraction layer in controllers
class UserController {
	/**
	 * Create a new user
	 */
	static async createUser(req, res) {
		const { username, email, password } = req.body;

		try {
			// Method 1: Use the abstraction layer directly
			const db = databaseManager.getDatabase();
			const user = await db.create('User', {
				username,
				email,
				password, // Will be hashed by model hooks
			});

			res.status(201).json({ message: 'User created successfully', user });
		} catch (error) {
			res.status(500).json({ message: 'Error creating user', error: error.message });
		}
	}

	/**
	 * Get all users
	 */
	static async getAllUsers(req, res) {
		try {
			// Method 2: Use the model getter (works with any database type)
			const UserModel = getModel('User');
			const users = await UserModel.findAll({
				attributes: ['id', 'username', 'email', 'isAdmin', 'profileImage'],
				order: [['createdAt', 'DESC']],
			});

			res.status(200).json(users);
		} catch (error) {
			res.status(500).json({ message: 'Error fetching users', error: error.message });
		}
	}

	/**
	 * Get user by ID
	 */
	static async getUserById(req, res) {
		const { id } = req.params;

		try {
			// Method 3: Use abstraction layer with advanced options
			const db = databaseManager.getDatabase();
			const user = await db.findByPk('User', id, {
				attributes: ['id', 'username', 'email', 'isAdmin', 'profileImage'],
				include: ['orders', 'pages'], // Works with associations
			});

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ message: 'Error fetching user', error: error.message });
		}
	}

	/**
	 * Update user
	 */
	static async updateUser(req, res) {
		const { id } = req.params;
		const { username, email, password, profileImage, isAdmin, roles } = req.body;

		try {
			// Use transaction for data consistency
			const db = databaseManager.getDatabase();
			const result = await db.transaction(async (transaction) => {
				// Prepare update data
				const updateData = {};
				if (username) updateData.username = username;
				if (email) updateData.email = email;
				if (password) updateData.password = password; // Will be hashed by hooks
				if (profileImage !== undefined) updateData.profileImage = profileImage;
				if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
				if (roles !== undefined) updateData.roles = roles;

				// Update user
				const [affectedRows] = await db.update('User', updateData, {
					where: { id },
					transaction,
				});

				if (affectedRows === 0) {
					throw new Error('User not found');
				}

				// Fetch updated user
				return await db.findByPk('User', id, {
					attributes: ['id', 'username', 'email', 'isAdmin', 'profileImage'],
					transaction,
				});
			});

			res.status(200).json({
				message: 'User updated successfully',
				user: result,
			});
		} catch (error) {
			res.status(500).json({ message: 'Error updating user', error: error.message });
		}
	}

	/**
	 * Delete user
	 */
	static async deleteUser(req, res) {
		const { id } = req.params;

		try {
			const db = databaseManager.getDatabase();

			// First, get user to clean up profile image
			const user = await db.findByPk('User', id);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Clean up profile image if exists
			if (user.profileImage) {
				const imagePath = path.join(__dirname, '..', 'uploads', 'profile-images', user.profileImage);
				if (fs.existsSync(imagePath)) {
					fs.unlinkSync(imagePath);
				}
			}

			// Delete user
			const deletedCount = await db.destroy('User', {
				where: { id },
			});

			if (deletedCount === 0) {
				return res.status(404).json({ message: 'User not found' });
			}

			res.status(200).json({ message: 'User deleted successfully' });
		} catch (error) {
			res.status(500).json({ message: 'Error deleting user', error: error.message });
		}
	}

	/**
	 * Get user permissions
	 */
	static async getUserPermissions(req, res) {
		const { id } = req.params;

		try {
			const db = databaseManager.getDatabase();

			// Get user with roles
			const user = await db.findByPk('User', id);
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			// Get user permissions (this logic would be database-agnostic)
			let permissions = {};

			if (user.roles) {
				const roleIds = user.roles.split(',').map(id => parseInt(id.trim()));

				// Get roles and their permissions
				const roles = await db.findAll('Role', {
					where: { id: roleIds },
				});

				// Merge permissions from all roles
				roles.forEach(role => {
					if (role.permissions) {
						permissions = { ...permissions, ...role.permissions };
					}
				});
			}

			res.status(200).json({
				userId: user.id,
				isAdmin: user.isAdmin,
				permissions,
			});
		} catch (error) {
			res.status(500).json({ message: 'Error fetching permissions', error: error.message });
		}
	}

	/**
	 * Search users (example of database-agnostic query)
	 */
	static async searchUsers(req, res) {
		const { query, page = 1, limit = 10 } = req.query;

		try {
			const db = databaseManager.getDatabase();
			const offset = (page - 1) * limit;

			// Build search criteria (works with different databases)
			const searchCriteria = {};
			if (query) {
				// For SQL databases, this would use LIKE
				// For MongoDB, this would use regex
				const dbType = databaseManager.getDatabaseType();
				if (dbType === 'sequelize') {
					const { Op } = require('sequelize');
					searchCriteria[Op.or] = [
						{ username: { [Op.like]: `%${query}%` } },
						{ email: { [Op.like]: `%${query}%` } },
					];
				} else if (dbType === 'mongodb') {
					searchCriteria.$or = [
						{ username: { $regex: query, $options: 'i' } },
						{ email: { $regex: query, $options: 'i' } },
					];
				}
			}

			const users = await db.findAll('User', {
				where: searchCriteria,
				attributes: ['id', 'username', 'email', 'isAdmin'],
				limit: parseInt(limit),
				offset: parseInt(offset),
				order: [['createdAt', 'DESC']],
			});

			const totalCount = await db.count('User', {
				where: searchCriteria,
			});

			res.status(200).json({
				users,
				pagination: {
					page: parseInt(page),
					limit: parseInt(limit),
					total: totalCount,
					pages: Math.ceil(totalCount / limit),
				},
			});
		} catch (error) {
			res.status(500).json({ message: 'Error searching users', error: error.message });
		}
	}
}

module.exports = UserController;
