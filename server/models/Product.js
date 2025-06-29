// Load environment variables first
require('dotenv').config({ path: '../../.env' });

const dbType = process.env.DB_TYPE || 'mysql';

// Only load Sequelize models for SQL databases
if (['mongodb', 'mongo'].includes(dbType.toLowerCase())) {
	// For MongoDB, export a placeholder that will be replaced by the abstraction layer
	module.exports = {
		name: 'Product',
		_isMongoPlaceholder: true,
		_schema: {
			name: { type: String, required: true },
			description: { type: String, required: true },
			price: { type: Number, required: true, min: 0 },
			category: { type: String, required: true },
			stock: { type: Number, required: true, min: 0, default: 0 },
			imageUrl: { type: String }
		}
	};
} else {
	// SQL database implementation
	const { DataTypes } = require("sequelize");
	const { sequelize } = require("../config/database");

	const Product = sequelize.define(
		"Product",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
				validate: {
					min: 0,
				},
			},
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			category: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 0,
				},
			},
		},
		{
			timestamps: true, // This will add createdAt and updatedAt automatically
		},);

	module.exports = Product;
}
