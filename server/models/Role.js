const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: {
				args: false,
				msg: 'Role name cannot be empty'
			}
		}
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	permissions: {
		type: DataTypes.JSON,
		allowNull: false,
		defaultValue: {},
		validate: {
			isValidPermissions(value) {
				const validPermissions = [
					'add_user',
					'delete_user',
					'edit_user',
					'add_product',
					'edit_product',
					'delete_product',
					'add_page',
					'edit_page',
					'delete_page'
				];

				if (typeof value !== 'object' || Array.isArray(value)) {
					throw new Error('Permissions must be an object');
				}

				for (const permission of Object.keys(value)) {
					if (!validPermissions.includes(permission)) {
						throw new Error(`Invalid permission: ${permission}`);
					}
					if (typeof value[permission] !== 'boolean') {
						throw new Error(`Permission ${permission} must be a boolean`);
					}
				}
			}
		}
	}
}, {
	timestamps: true
});

module.exports = Role;
