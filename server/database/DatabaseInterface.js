/**
 * Database Abstraction Layer Interface
 * Defines the contract that all database implementations must follow
 */

class DatabaseInterface {
	/**
	 * Connect to the database
	 * @returns {Promise<void>}
	 */
	async connect() {
		throw new Error('connect() method must be implemented');
	}

	/**
	 * Disconnect from the database
	 * @returns {Promise<void>}
	 */
	async disconnect() {
		throw new Error('disconnect() method must be implemented');
	}

	/**
	 * Sync/migrate database schema
	 * @param {Object} options - Sync options
	 * @returns {Promise<void>}
	 */
	async sync(options = {}) {
		throw new Error('sync() method must be implemented');
	}

	/**
	 * Create a new record
	 * @param {string} model - Model name
	 * @param {Object} data - Data to create
	 * @returns {Promise<Object>}
	 */
	async create(model, data) {
		throw new Error('create() method must be implemented');
	}

	/**
	 * Find records
	 * @param {string} model - Model name
	 * @param {Object} options - Query options
	 * @returns {Promise<Array>}
	 */
	async findAll(model, options = {}) {
		throw new Error('findAll() method must be implemented');
	}

	/**
	 * Find a single record
	 * @param {string} model - Model name
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async findOne(model, options = {}) {
		throw new Error('findOne() method must be implemented');
	}

	/**
	 * Find record by primary key
	 * @param {string} model - Model name
	 * @param {*} id - Primary key value
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async findByPk(model, id, options = {}) {
		throw new Error('findByPk() method must be implemented');
	}

	/**
	 * Update records
	 * @param {string} model - Model name
	 * @param {Object} data - Data to update
	 * @param {Object} options - Update options
	 * @returns {Promise<Array>} [affectedCount, affectedRows]
	 */
	async update(model, data, options) {
		throw new Error('update() method must be implemented');
	}

	/**
	 * Delete records
	 * @param {string} model - Model name
	 * @param {Object} options - Delete options
	 * @returns {Promise<number>} Number of deleted records
	 */
	async destroy(model, options) {
		throw new Error('destroy() method must be implemented');
	}

	/**
	 * Count records
	 * @param {string} model - Model name
	 * @param {Object} options - Count options
	 * @returns {Promise<number>}
	 */
	async count(model, options = {}) {
		throw new Error('count() method must be implemented');
	}

	/**
	 * Create multiple records
	 * @param {string} model - Model name
	 * @param {Array} data - Array of data objects to create
	 * @param {Object} options - Bulk create options
	 * @returns {Promise<Array>}
	 */
	async bulkCreate(model, data, options = {}) {
		throw new Error('bulkCreate() method must be implemented');
	}

	/**
	 * Execute raw query
	 * @param {string} query - Raw query string
	 * @param {Object} options - Query options
	 * @returns {Promise<*>}
	 */
	async query(query, options = {}) {
		throw new Error('query() method must be implemented');
	}

	/**
	 * Start a transaction
	 * @returns {Promise<Object>} Transaction object
	 */
	async startTransaction() {
		throw new Error('startTransaction() method must be implemented');
	}

	/**
	 * Commit transaction
	 * @param {Object} transaction - Transaction object
	 * @returns {Promise<void>}
	 */
	async commitTransaction(transaction) {
		throw new Error('commitTransaction() method must be implemented');
	}

	/**
	 * Rollback transaction
	 * @param {Object} transaction - Transaction object
	 * @returns {Promise<void>}
	 */
	async rollbackTransaction(transaction) {
		throw new Error('rollbackTransaction() method must be implemented');
	}

	/**
	 * Get model definition/schema
	 * @param {string} model - Model name
	 * @returns {Object}
	 */
	getModel(model) {
		throw new Error('getModel() method must be implemented');
	}

	/**
	 * Define model associations
	 * @param {Object} associations - Association configurations
	 * @returns {void}
	 */
	defineAssociations(associations) {
		throw new Error('defineAssociations() method must be implemented');
	}

	/**
	 * Get database type identifier
	 * @returns {string}
	 */
	getType() {
		throw new Error('getType() method must be implemented');
	}

	/**
	 * Health check - verify database connection
	 * @returns {Promise<boolean>}
	 */
	async healthCheck() {
		throw new Error('healthCheck() method must be implemented');
	}
}

module.exports = DatabaseInterface;
