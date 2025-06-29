// Load environment variables first
require('dotenv').config({ path: '../../.env' });

const dbType = process.env.DB_TYPE || 'mysql';

// Only load Sequelize models for SQL databases
if (['mongodb', 'mongo'].includes(dbType.toLowerCase())) {
	// For MongoDB, export a placeholder that will be replaced by the abstraction layer
	module.exports = {
		name: 'Order',
		_isMongoPlaceholder: true,
		_schema: {
			totalAmount: { type: Number, required: true, min: 0 },
			orderDate: { type: Date, default: Date.now },
			status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
			userId: { type: String, required: true }, // Reference to User
			products: [{ // Array of products in this order
				productId: { type: String, required: true },
				quantity: { type: Number, required: true, min: 1 },
				price: { type: Number, required: true, min: 0 }
			}]
		}
	};
} else {
	// SQL database implementation
	const { DataTypes } = require("sequelize");
	const { sequelize } = require("../config/database");

	const Order = sequelize.define(
		"Order",
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			totalAmount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
				validate: {
					min: 0,
				},
			},
			orderDate: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			status: {
				type: DataTypes.ENUM(
					"Pending",
					"Shipped",
					"Delivered",
					"Cancelled",
				),
				defaultValue: "Pending",
			},
		},
		{
			timestamps: true,
		},);

	module.exports = Order;
}
