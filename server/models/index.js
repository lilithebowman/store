'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const { sequelize } = require('../config/database');  // Use your existing connection
const db = {};

// Skip loading the current file
fs.readdirSync(__dirname)
	.filter(file => {
		return (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file.indexOf('.test.js') === -1
		);
	})
	.forEach(file => {
		// Simply require the model (don't try to call it as a function)
		const model = require(path.join(__dirname, file));
		db[model.name] = model;
	});

// Define model associations
const { User, Product, Order } = db;

if (!User || !Product || !Order) {
  throw new Error(
    'Required models (User, Product, Order) were not registered. ' +
    'Check model filenames and exports.'
  );
}

// Set up associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Create the join table for Order-Product
const OrderProduct = sequelize.define('OrderProduct', {
	quantity: {
		type: Sequelize.DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
		validate: {
			min: 1
		}
	},
	price: {
		type: Sequelize.DataTypes.DECIMAL(10, 2),
		allowNull: false
	}
});

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

// Add syncDatabase function to synchronize models with the database
const syncDatabase = async () => {
	try {
		// In development, you might want to use { force: true } to recreate tables
		// In production, use { alter: true } or no options
		await sequelize.sync();
		console.log('Database synchronized successfully');
	} catch (error) {
		console.error('Error synchronizing database:', error);
		throw error;  // Re-throw to be caught by the caller
	}
};

// Add all models to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.OrderProduct = OrderProduct;
db.syncDatabase = syncDatabase;  // Export the syncDatabase function

module.exports = db;
