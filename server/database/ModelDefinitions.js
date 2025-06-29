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
				DECIMAL: Number, // Use Number instead of Decimal128 for simplicity
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

	// Helper function to create field definition based on database type
	const createField = (baseDefinition, sequelizeExtras = {}, mongoExtras = {}) => {
		if (databaseType === 'sequelize') {
			return { ...baseDefinition, ...sequelizeExtras };
		} else if (databaseType === 'mongodb') {
			const field = { ...baseDefinition, ...mongoExtras };
			// Remove Sequelize-specific properties
			delete field.allowNull;
			delete field.primaryKey;
			delete field.autoIncrement;
			delete field.defaultValue;

			// Convert Sequelize terms to MongoDB terms
			if (field.required === undefined && baseDefinition.required !== undefined) {
				field.required = baseDefinition.required;
			}

			return field;
		}

		return baseDefinition;
	};

	const definitions = {
		User: {
			schema: {
				...(databaseType === 'sequelize' && {
					id: {
						type: DataTypes.INTEGER,
						primaryKey: true,
						autoIncrement: true,
					}
				}),
				username: createField(
					{
						type: DataTypes.STRING,
						required: true,
						unique: true,
					},
					{
						allowNull: false,
						validate: {
							notEmpty: true,
						},
					},
					{
						required: true,
						unique: true,
					}
				),
				email: createField(
					{
						type: DataTypes.STRING,
						required: true,
						unique: true,
					},
					{
						allowNull: false,
						validate: {
							isEmail: true,
						},
					},
					{
						required: true,
						unique: true,
						match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
					}
				),
				password: createField(
					{
						type: DataTypes.STRING,
						required: true,
					},
					{
						allowNull: false,
					},
					{
						required: true,
					}
				),
				oauthProvider: createField(
					{
						type: DataTypes.STRING,
					},
					{
						type: DataTypes.ENUM('google', 'facebook', 'github'),
						allowNull: true,
					},
					{
						type: DataTypes.STRING,
						enum: ['google', 'facebook', 'github'],
						required: false,
					}
				),
				oauthId: createField(
					{
						type: DataTypes.STRING,
					},
					{
						allowNull: true,
					},
					{
						required: false,
					}
				),
				isAdmin: createField(
					{
						type: DataTypes.BOOLEAN,
						default: false,
					},
					{
						allowNull: false,
						defaultValue: false,
					},
					{
						type: DataTypes.BOOLEAN,
						default: false,
					}
				),
				profileImage: createField(
					{
						type: DataTypes.STRING,
					},
					{
						allowNull: true,
					},
					{
						required: false,
					}
				),
				roles: createField(
					{
						type: DataTypes.STRING,
						default: null,
					},
					{
						allowNull: true,
						defaultValue: null,
					},
					{
						type: DataTypes.STRING,
						default: null,
					}
				),
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
					// MongoDB hooks - these will be handled by MongoDatabase.js
					mongooseHooks: {
						preSave: async function (next) {
							if (this.isModified('password')) {
								this.password = await bcrypt.hash(this.password, 10);
							}
							next();
						}
					}
				},
			},
		},

		Product: {
			schema: {
				...(databaseType === 'sequelize' && {
					id: {
						type: DataTypes.INTEGER,
						primaryKey: true,
						autoIncrement: true,
					}
				}),
				name: createField(
					{
						type: DataTypes.STRING,
						required: true,
					},
					{
						allowNull: false,
						validate: {
							notEmpty: true,
						},
					},
					{
						required: true,
					}
				),
				description: createField(
					{
						type: DataTypes.TEXT,
						required: true,
					},
					{
						allowNull: false,
					},
					{
						required: true,
					}
				),
				price: createField(
					{
						type: DataTypes.DECIMAL,
						required: true,
					},
					{
						allowNull: false,
						validate: {
							min: 0,
						},
					},
					{
						required: true,
						min: 0,
					}
				),
				imageUrl: createField(
					{
						type: DataTypes.STRING,
						required: true,
					},
					{
						allowNull: false,
					},
					{
						required: true,
					}
				),
				category: createField(
					{
						type: DataTypes.STRING,
						required: true,
					},
					{
						allowNull: false,
					},
					{
						required: true,
					}
				),
				stock: createField(
					{
						type: DataTypes.INTEGER,
						required: true,
					},
					{
						allowNull: false,
						validate: {
							min: 0,
						},
					},
					{
						required: true,
						min: 0,
					}
				),
			},
			options: {
				timestamps: true,
			},
		},

		Order: {
			schema: {
				...(databaseType === 'sequelize' && {
					id: {
						type: DataTypes.INTEGER,
						primaryKey: true,
						autoIncrement: true,
					}
				}),
				totalAmount: createField(
					{
						type: DataTypes.DECIMAL,
						required: true,
					},
					{
						allowNull: false,
						validate: {
							min: 0,
						},
					},
					{
						required: true,
						min: 0,
					}
				),
				orderDate: createField(
					{
						type: DataTypes.DATE,
						default: Date.now,
					},
					{
						type: DataTypes.DATE,
						defaultValue: DataTypes.NOW,
					},
					{
						type: DataTypes.DATE,
						default: Date.now,
					}
				),
				status: createField(
					{
						type: DataTypes.STRING,
						default: 'Pending',
					},
					{
						type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
						defaultValue: 'Pending',
					},
					{
						type: DataTypes.STRING,
						enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
						default: 'Pending',
					}
				),
				userId: createField(
					{},
					{
						type: DataTypes.INTEGER,
						references: {
							model: 'User',
							key: 'id',
						},
					},
					{
						type: DataTypes.ObjectId,
						ref: 'User',
					}
				),
			},
			options: {
				timestamps: true,
			},
		},

		Page: {
			schema: {
				...(databaseType === 'sequelize' && {
					id: {
						type: DataTypes.INTEGER,
						primaryKey: true,
						autoIncrement: true,
					}
				}),
				title: createField(
					{
						type: DataTypes.STRING,
						required: true,
					},
					{
						allowNull: false,
						validate: {
							notEmpty: true,
							len: [1, 200],
						},
					},
					{
						required: true,
						maxlength: 200,
					}
				),
				slug: createField(
					{
						type: DataTypes.STRING,
						required: true,
						unique: true,
					},
					{
						allowNull: false,
						unique: true,
					},
					{
						required: true,
						unique: true,
					}
				),
				content: createField(
					{
						type: DataTypes.TEXT,
					},
					{
						allowNull: true,
					},
					{
						required: false,
					}
				),
				components: createField(
					{
						type: DataTypes.JSON,
						default: null,
					},
					{
						allowNull: true,
						defaultValue: null,
					},
					{
						type: DataTypes.JSON,
						default: null,
					}
				),
				metaDescription: createField(
					{
						type: DataTypes.STRING,
					},
					{
						allowNull: true,
						validate: {
							len: [0, 300],
						},
					},
					{
						required: false,
						maxlength: 300,
					}
				),
				status: createField(
					{
						type: DataTypes.STRING,
						default: 'draft',
					},
					{
						type: DataTypes.ENUM('draft', 'published', 'archived'),
						defaultValue: 'draft',
						allowNull: false,
					},
					{
						type: DataTypes.STRING,
						enum: ['draft', 'published', 'archived'],
						default: 'draft',
					}
				),
				authorId: createField(
					{},
					{
						type: DataTypes.INTEGER,
						allowNull: true,
						references: {
							model: 'User',
							key: 'id',
						},
					},
					{
						type: DataTypes.ObjectId,
						ref: 'User',
						required: false,
					}
				),
				publishedAt: createField(
					{
						type: DataTypes.DATE,
					},
					{
						allowNull: true,
					},
					{
						required: false,
					}
				),
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
				...(databaseType === 'sequelize' && {
					id: {
						type: DataTypes.INTEGER,
						primaryKey: true,
						autoIncrement: true,
					}
				}),
				name: createField(
					{
						type: DataTypes.STRING,
						required: true,
						unique: true,
					},
					{
						allowNull: false,
						unique: true,
					},
					{
						required: true,
						unique: true,
					}
				),
				description: createField(
					{
						type: DataTypes.TEXT,
					},
					{
						allowNull: true,
					},
					{
						required: false,
					}
				),
				permissions: createField(
					{
						type: DataTypes.JSON,
						default: {},
					},
					{
						allowNull: false,
						defaultValue: {},
					},
					{
						type: DataTypes.JSON,
						default: {},
					}
				),
			},
			options: {
				timestamps: true,
			},
		},
	};

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
