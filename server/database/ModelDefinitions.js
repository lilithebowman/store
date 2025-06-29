/**
 * Model Definitions
 * Database-agnostic model schemas
 */

// Import data types based on database type
const getDataTypes = (databaseType) => {
	switch (databaseType) {
		case 'sequelize':
			const { DataTypes } = require('sequelize');
			return {
				INTEGER: DataTypes.INTEGER,
				STRING: DataTypes.STRING,
				TEXT: DataTypes.TEXT,
				BOOLEAN: DataTypes.BOOLEAN,
				DECIMAL: DataTypes.DECIMAL,
				DATE: DataTypes.DATE,
				JSON: DataTypes.JSON,
				ENUM: DataTypes.ENUM,
				NOW: DataTypes.NOW,
			};
		case 'mongodb':
			const mongoose = require('mongoose');
			return {
				INTEGER: Number,
				STRING: String,
				TEXT: String,
				BOOLEAN: Boolean,
				DECIMAL: mongoose.Schema.Types.Decimal128,
				DATE: Date,
				JSON: mongoose.Schema.Types.Mixed,
				ENUM: String,
				NOW: Date,
				ObjectId: mongoose.Schema.Types.ObjectId,
			};
		default:
			throw new Error(`Unsupported database type: ${databaseType}`);
	}
};

const createModelDefinitions = (databaseType = 'sequelize') => {
	const DataTypes = getDataTypes(databaseType);
	const bcrypt = require('bcrypt');

	const definitions = {
		User: {
			schema: {
				id: databaseType === 'mongodb' ? undefined : {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				username: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: databaseType === 'sequelize' ? {
						notEmpty: true,
					} : undefined,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: databaseType === 'sequelize' ? {
						isEmail: true,
					} : undefined,
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				oauthProvider: databaseType === 'sequelize' ? {
					type: DataTypes.ENUM('google', 'facebook', 'github'),
					allowNull: true,
				} : {
					type: DataTypes.STRING,
					enum: ['google', 'facebook', 'github'],
				},
				oauthId: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				isAdmin: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					default: false,
				},
				profileImage: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				roles: {
					type: DataTypes.STRING,
					allowNull: true,
					default: null,
				},
			},
			options: {
				timestamps: true,
				hooks: databaseType === 'sequelize' ? {
					beforeCreate: async (user) => {
						if (user.password) {
							user.password = await bcrypt.hash(user.password, 10);
						}
					},
					beforeUpdate: async (user) => {
						if (user.changed('password')) {
							user.password = await bcrypt.hash(user.password, 10);
						}
					},
				} : {
					pre: [
						{
							method: 'save',
							fn: async function (next) {
								if (this.isModified('password')) {
									this.password = await bcrypt.hash(this.password, 10);
								}
								next();
							}
						}
					]
				},
			},
		},

		Product: {
			schema: {
				id: databaseType === 'mongodb' ? undefined : {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: databaseType === 'sequelize' ? {
						notEmpty: true,
					} : undefined,
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: false,
				},
				price: {
					type: DataTypes.DECIMAL,
					allowNull: false,
					validate: databaseType === 'sequelize' ? {
						min: 0,
					} : undefined,
				},
				imageUrl: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				category: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				stock: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: databaseType === 'sequelize' ? {
						min: 0,
					} : undefined,
				},
			},
			options: {
				timestamps: true,
			},
		},

		Order: {
			schema: {
				id: databaseType === 'mongodb' ? undefined : {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				totalAmount: {
					type: DataTypes.DECIMAL,
					allowNull: false,
					validate: databaseType === 'sequelize' ? {
						min: 0,
					} : undefined,
				},
				orderDate: {
					type: DataTypes.DATE,
					default: databaseType === 'sequelize' ? DataTypes.NOW : Date.now,
				},
				status: databaseType === 'sequelize' ? {
					type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
					defaultValue: 'Pending',
				} : {
					type: DataTypes.STRING,
					enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
					default: 'Pending',
				},
				userId: databaseType === 'mongodb' ? {
					type: DataTypes.ObjectId,
					ref: 'User',
				} : {
					type: DataTypes.INTEGER,
					references: {
						model: 'User',
						key: 'id',
					},
				},
			},
			options: {
				timestamps: true,
			},
		},

		Page: {
			schema: {
				id: databaseType === 'mongodb' ? undefined : {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				title: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: databaseType === 'sequelize' ? {
						notEmpty: true,
						len: [1, 200],
					} : undefined,
				},
				slug: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				content: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				components: {
					type: DataTypes.JSON,
					allowNull: true,
					default: null,
				},
				metaDescription: {
					type: DataTypes.STRING,
					allowNull: true,
					validate: databaseType === 'sequelize' ? {
						len: [0, 300],
					} : undefined,
				},
				status: databaseType === 'sequelize' ? {
					type: DataTypes.ENUM('draft', 'published', 'archived'),
					defaultValue: 'draft',
					allowNull: false,
				} : {
					type: DataTypes.STRING,
					enum: ['draft', 'published', 'archived'],
					default: 'draft',
				},
				authorId: databaseType === 'mongodb' ? {
					type: DataTypes.ObjectId,
					ref: 'User',
				} : {
					type: DataTypes.INTEGER,
					allowNull: true,
					references: {
						model: 'User',
						key: 'id',
					},
				},
				publishedAt: {
					type: DataTypes.DATE,
					allowNull: true,
				},
			},
			options: {
				timestamps: true,
				hooks: databaseType === 'sequelize' ? {
					beforeSave: (page) => {
						if (page.status === 'published' && !page.publishedAt) {
							page.publishedAt = new Date();
						}
					},
				} : {
					pre: [
						{
							method: 'save',
							fn: function (next) {
								if (this.status === 'published' && !this.publishedAt) {
									this.publishedAt = new Date();
								}
								next();
							}
						}
					]
				},
			},
		},

		Role: {
			schema: {
				id: databaseType === 'mongodb' ? undefined : {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				permissions: {
					type: DataTypes.JSON,
					allowNull: false,
					default: {},
				},
			},
			options: {
				timestamps: true,
			},
		},
	};

	// Filter out undefined fields for MongoDB
	if (databaseType === 'mongodb') {
		Object.keys(definitions).forEach(modelName => {
			const schema = definitions[modelName].schema;
			Object.keys(schema).forEach(fieldName => {
				if (schema[fieldName] === undefined) {
					delete schema[fieldName];
				}
			});
		});
	}

	return definitions;
};

const createAssociations = (databaseType = 'sequelize') => {
	if (databaseType === 'sequelize') {
		return {
			User: {
				hasMany: [
					{ model: 'Order', options: { foreignKey: 'userId' } },
					{ model: 'Page', options: { foreignKey: 'authorId', as: 'pages' } },
				],
			},
			Order: {
				belongsTo: [
					{ model: 'User', options: { foreignKey: 'userId' } },
				],
				belongsToMany: [
					{ model: 'Product', options: { through: 'OrderProduct' } },
				],
			},
			Product: {
				belongsToMany: [
					{ model: 'Order', options: { through: 'OrderProduct' } },
				],
			},
			Page: {
				belongsTo: [
					{ model: 'User', options: { foreignKey: 'authorId', as: 'author' } },
				],
			},
		};
	} else if (databaseType === 'mongodb') {
		return {
			Order: {
				belongsTo: [
					{ model: 'User', field: 'userId' },
				],
				belongsToMany: [
					{ model: 'Product', field: 'products' },
				],
			},
			Page: {
				belongsTo: [
					{ model: 'User', field: 'authorId' },
				],
			},
		};
	}

	return {};
};

module.exports = {
	createModelDefinitions,
	createAssociations,
	getDataTypes,
};
