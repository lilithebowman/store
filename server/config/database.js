/**
 * Database Configuration with Abstraction Layer
 * Supports multiple database types through unified interface
 */

const { databaseManager } = require('../database/DatabaseManager');
const { createModelDefinitions, createAssociations } = require('../database/ModelDefinitions');
require('dotenv').config({ path: '../.env' });

// Initialize database with abstraction layer
const initializeDatabase = async () => {
	try {
		// Initialize database connection
		await databaseManager.initialize();

		// Get database type to create appropriate model definitions
		const databaseType = databaseManager.getDatabaseType();

		// Define models
		const modelDefinitions = createModelDefinitions(databaseType);
		databaseManager.defineModels(modelDefinitions);

		// Define associations
		const associations = createAssociations(databaseType);
		databaseManager.defineAssociations(associations);

		console.log('✅ Database abstraction layer initialized successfully');
		return databaseManager;
	} catch (error) {
		console.error('❌ Database initialization failed:', error.message);
		throw error;
	}
};

// Legacy compatibility - maintain existing interface
const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");

// Function to create the database if it doesn't exist (backwards compatibility)
const createDatabaseIfNotExists = async () => {
	// Only for MySQL/SQL databases
	const dbType = process.env.DB_TYPE || process.env.DATABASE_TYPE || 'mysql';

	if (!['mysql', 'mariadb'].includes(dbType.toLowerCase())) {
		console.log('Skipping database creation - not supported for', dbType);
		return;
	}

	const connection = await mysql.createConnection({
		host: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
		user: process.env.MYSQL_USERNAME || process.env.DB_USER,
		password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
	});

	const dbName = process.env.MYSQL_DATABASE || process.env.DB_NAME || "ecommerce_db";
	await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
	await connection.end();
};

// Legacy Sequelize instance (for backwards compatibility)
let sequelize = null;

const getSequelize = () => {
	// Only create Sequelize for SQL databases
	const dbType = process.env.DB_TYPE || 'mysql';
	if (['mongodb', 'mongo'].includes(dbType.toLowerCase())) {
		throw new Error('Sequelize should not be used with MongoDB. Use the abstraction layer instead.');
	}

	if (!sequelize) {
		// Create Sequelize instance for backwards compatibility
		if (process.env.DATABASE_URL) {
			sequelize = new Sequelize(process.env.DATABASE_URL, {
				logging: process.env.NODE_ENV === "development" ? console.log : false,
			});
		} else {
			sequelize = new Sequelize({
				dialect: "mysql",
				host: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
				username: process.env.MYSQL_USERNAME || process.env.DB_USER,
				password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD,
				database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "ecommerce_db",
				pool: {
					max: 10,
					min: 0,
					acquire: 30000,
					idle: 10000,
				},
				logging: process.env.NODE_ENV === "development" ? console.log : false,
			});
		}
	}
	return sequelize;
};

const connectDB = async () => {
	try {
		// Use new abstraction layer by default
		await initializeDatabase();
		console.log("Database connection established successfully");
	} catch (error) {
		console.error("❌ Database connection failed:", error.message);

		// For SQL databases, try legacy approach as fallback
		const dbType = process.env.DB_TYPE || 'mysql';
		if (['mysql', 'mariadb', 'postgres', 'postgresql', 'sqlite'].includes(dbType.toLowerCase())) {
			console.log("Falling back to legacy database connection...");
			try {
				await createDatabaseIfNotExists();
				const legacySequelize = getSequelize();
				await legacySequelize.authenticate();
				console.log("Legacy SQL connection established successfully");

				// Store legacy sequelize in database manager for compatibility
				databaseManager.legacySequelize = legacySequelize;
			} catch (legacyError) {
				console.error("❌ Legacy connection also failed:", legacyError.message);
				throw legacyError;
			}
		} else {
			// For non-SQL databases, don't try legacy approach
			throw error;
		}
	}
};

// Export both new and legacy interfaces
module.exports = {
	// New abstraction layer
	databaseManager,
	initializeDatabase,

	// Legacy compatibility - only create Sequelize instance for SQL databases
	get sequelize() {
		const dbType = process.env.DB_TYPE || 'mysql';
		if (['mongodb', 'mongo'].includes(dbType.toLowerCase())) {
			return null; // No Sequelize for MongoDB
		}
		return getSequelize();
	},
	connectDB,
	createDatabaseIfNotExists,

	// Utility functions
	getDatabase: () => databaseManager.getDatabase(),
	getModel: (modelName) => {
		try {
			return databaseManager.getModel(modelName);
		} catch (error) {
			// Fallback to legacy Sequelize models if available
			const legacySequelize = databaseManager.legacySequelize || getSequelize();
			return legacySequelize.models[modelName];
		}
	},
};
