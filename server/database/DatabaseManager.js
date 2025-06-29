/**
 * Database Configuration with Abstraction Layer
 * Provides a unified interface for different database types
 */

const DatabaseFactory = require('./DatabaseFactory');
require('dotenv').config({ path: '../.env' });

class DatabaseManager {
	constructor() {
		this.database = null;
		this.models = {};
		this.isConnected = false;
	}

	/**
	 * Initialize database connection
	 * @param {Object} customConfig - Optional custom configuration
	 * @returns {Promise<void>}
	 */
	async initialize(customConfig = null) {
		try {
			// Create configuration from environment or use custom config
			const config = customConfig || DatabaseFactory.createConfigFromEnv();

			// Validate configuration
			DatabaseFactory.validateConfig(config);

			// Create database instance
			this.database = DatabaseFactory.create(config);

			// Connect to database
			await this.database.connect();
			this.isConnected = true;

			console.log(`✅ Database manager initialized with ${config.type.toUpperCase()}`);
		} catch (error) {
			console.error('❌ Database initialization failed:', error.message);
			throw error;
		}
	}

	/**
	 * Define models and their schemas
	 * @param {Object} modelDefinitions - Model definitions
	 * @returns {void}
	 */
	defineModels(modelDefinitions) {
		if (!this.database) {
			throw new Error('Database not initialized');
		}

		Object.keys(modelDefinitions).forEach(modelName => {
			const { schema, options } = modelDefinitions[modelName];
			this.database.defineModel(modelName, schema, options);
		});

		console.log(`✅ Defined ${Object.keys(modelDefinitions).length} models`);
	}

	/**
	 * Define model associations
	 * @param {Object} associations - Association definitions
	 * @returns {void}
	 */
	defineAssociations(associations) {
		if (!this.database) {
			throw new Error('Database not initialized');
		}

		this.database.defineAssociations(associations);
		console.log('✅ Model associations defined');
	}

	/**
	 * Sync database schema
	 * @param {Object} options - Sync options
	 * @returns {Promise<void>}
	 */
	async sync(options = {}) {
		if (!this.database) {
			throw new Error('Database not initialized');
		}

		await this.database.sync(options);
	}

	/**
	 * Get database instance
	 * @returns {DatabaseInterface}
	 */
	getDatabase() {
		if (!this.database) {
			throw new Error('Database not initialized');
		}
		return this.database;
	}

	/**
	 * Get model by name
	 * @param {string} modelName - Model name
	 * @returns {Object}
	 */
	getModel(modelName) {
		if (!this.database) {
			throw new Error('Database not initialized');
		}
		return this.database.getModel(modelName);
	}

	/**
	 * Health check
	 * @returns {Promise<boolean>}
	 */
	async healthCheck() {
		if (!this.database) return false;
		return await this.database.healthCheck();
	}

	/**
	 * Close database connection
	 * @returns {Promise<void>}
	 */
	async close() {
		if (this.database) {
			await this.database.disconnect();
			this.isConnected = false;
			console.log('Database connection closed');
		}
	}

	/**
	 * Check if database is connected
	 * @returns {boolean}
	 */
	isConnectedToDatabase() {
		return this.isConnected;
	}

	/**
	 * Get database type
	 * @returns {string}
	 */
	getDatabaseType() {
		if (!this.database) return null;
		return this.database.getType();
	}

	/**
	 * Execute raw query
	 * @param {string} query - Query string
	 * @param {Object} options - Query options
	 * @returns {Promise<*>}
	 */
	async query(query, options = {}) {
		if (!this.database) {
			throw new Error('Database not initialized');
		}
		return await this.database.query(query, options);
	}

	/**
	 * Start a transaction
	 * @returns {Promise<Object>}
	 */
	async startTransaction() {
		if (!this.database) {
			throw new Error('Database not initialized');
		}
		return await this.database.startTransaction();
	}

	/**
	 * Execute callback within transaction
	 * @param {Function} callback - Transaction callback
	 * @returns {Promise<*>}
	 */
	async transaction(callback) {
		const transaction = await this.startTransaction();
		try {
			const result = await callback(transaction);
			await this.database.commitTransaction(transaction);
			return result;
		} catch (error) {
			await this.database.rollbackTransaction(transaction);
			throw error;
		}
	}
}

// Create singleton instance
const databaseManager = new DatabaseManager();

// Legacy compatibility functions
const connectDB = async () => {
	await databaseManager.initialize();
};

const syncDatabase = async (options = {}) => {
	await databaseManager.sync(options);
};

module.exports = {
	DatabaseManager,
	databaseManager,
	connectDB,
	syncDatabase,
};
