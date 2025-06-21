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
		let model;
		try {
			model = require(path.join(__dirname, file));
		} catch (err) {
			console.error(`Failed to load model file ${file}:`, err);
			throw err; // re-throw so CI fails fast
		}
		if (!model?.name) {
			throw new Error(`Model in ${file} does not export a Sequelize model instance`);
		}
		db[model.name] = model;
	});

// Define model associations
const { User, Product, Order, Role, Page } = db;

if (!User || !Product || !Order) {
	throw new Error(
		'Required models (User, Product, Order) were not registered. ' +
		'Check model filenames and exports.'
	);
}

// Set up associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Page-User associations (if Page model exists)
if (Page) {
	User.hasMany(Page, { foreignKey: 'authorId', as: 'pages' });
	Page.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
}

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
		// Database sync - no force or alter needed in production
		await sequelize.sync();
		console.log('Database synchronized successfully');

		// Check if there are any products, and create sample ones if needed
		const productCount = await Product.count();
		if (productCount === 0) {
			// Create some sample products
			const sampleProducts = [
				{
					name: 'Laptop',
					description: 'High-performance laptop with latest specs',
					price: 999.99,
					imageUrl: 'https://via.placeholder.com/300x200?text=Laptop',
					category: 'Electronics',
					stock: 15
				},
				{
					name: 'Smartphone',
					description: 'Latest smartphone with advanced camera',
					price: 699.99,
					imageUrl: 'https://via.placeholder.com/300x200?text=Smartphone',
					category: 'Electronics',
					stock: 25
				},
				{
					name: 'Coffee Maker',
					description: 'Premium coffee maker for perfect brew',
					price: 129.99,
					imageUrl: 'https://via.placeholder.com/300x200?text=CoffeeMaker',
					category: 'Home',
					stock: 10
				}
			];

			await Product.bulkCreate(sampleProducts);
			console.log('Sample products created successfully');
		}
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
