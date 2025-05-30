const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
	const connection = await mysql.createConnection({
		host: process.env.MYSQL_HOST || 'localhost',
		user: process.env.MYSQL_USERNAME,
		password: process.env.MYSQL_PASSWORD,
	});

	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DATABASE || 'ecommerce_db'}\`;`);
	await connection.end();
};

// Parse the connection string from DATABASE_URL
// or use individual environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL || {
	dialect: 'mysql',
	host: process.env.MYSQL_HOST || 'localhost',
	username: process.env.MYSQL_USERNAME,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE || 'ecommerce_db',
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	logging: process.env.NODE_ENV === 'development' ? console.log : false
});

const connectDB = async () => {
	try {
		await createDatabaseIfNotExists();
		await sequelize.authenticate();
		console.log('MySQL connection established successfully');
	} catch (error) {
		console.error('MySQL connection failed:', error.message);
		process.exit(1);
	}
};

module.exports = { sequelize, connectDB };