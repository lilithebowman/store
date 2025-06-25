const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/database");

const User = sequelize.define(
	"User",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
			},
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		oauthProvider: {
			type: DataTypes.ENUM("google", "facebook", "github"),
			allowNull: true,
		},
		oauthId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		profileImage: {
			type: DataTypes.STRING,
			allowNull: true,
			validate: {
				notEmpty: {
					args: false,
					msg: "Profile image path cannot be empty",
				},
			},
		},
		roles: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			comment: "Comma-separated list of role IDs",
			validate: {
				isValidRoles(value) {
					if (value && typeof value !== "string") {
						throw new Error("Roles must be a string");
					}
					if (value && !/^(\d+)(,\d+)*$/.test(value)) {
						throw new Error(
							"Roles must be comma-separated numbers",
						);
					}
				},
			},
		},
	},
	{
		timestamps: true,
		hooks: {
			beforeCreate: async (user) => {
				if (user.password) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
			beforeUpdate: async (user) => {
				if (user.changed("password")) {
					user.password = await bcrypt.hash(user.password, 10);
				}
			},
		},
	},
);

// Instance method to compare password
User.prototype.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

// Instance method to check if user has specific permission
User.prototype.hasPermission = async function (permission) {
	// Admin users have all permissions
	if (this.isAdmin) {
		return true;
	}

	// Check role-based permissions
	if (!this.roles) {
		return false;
	}

	const Role = require("./Role");
	const roleIds = this.roles.split(",").map((id) => parseInt(id.trim()));

	const roles = await Role.findAll({
		where: {
			id: roleIds,
		},
	});

	for (const role of roles) {
		if (role.permissions && role.permissions[permission] === true) {
			return true;
		}
	}

	return false;
};

// Instance method to get all user permissions
User.prototype.getPermissions = async function () {
	// Admin users have all permissions
	if (this.isAdmin) {
		return {
			add_user: true,
			delete_user: true,
			edit_user: true,
			add_product: true,
			edit_product: true,
			delete_product: true,
			add_page: true,
			edit_page: true,
			delete_page: true,
		};
	}

	if (!this.roles) {
		return {};
	}

	const Role = require("./Role");
	const roleIds = this.roles.split(",").map((id) => parseInt(id.trim()));

	const roles = await Role.findAll({
		where: {
			id: roleIds,
		},
	});

	const permissions = {};
	for (const role of roles) {
		if (role.permissions) {
			Object.assign(permissions, role.permissions);
		}
	}

	return permissions;
};

module.exports = User;
