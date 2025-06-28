/**
 * Abstract Model Base Class
 * Provides a database-agnostic way to define models
 */

class ModelBase {
	constructor(database, modelName) {
		this.database = database;
		this.modelName = modelName;
	}

	/**
	 * Create a new record
	 * @param {Object} data - Data to create
	 * @returns {Promise<Object>}
	 */
	async create(data) {
		return await this.database.create(this.modelName, data);
	}

	/**
	 * Find all records
	 * @param {Object} options - Query options
	 * @returns {Promise<Array>}
	 */
	async findAll(options = {}) {
		return await this.database.findAll(this.modelName, options);
	}

	/**
	 * Find one record
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async findOne(options = {}) {
		return await this.database.findOne(this.modelName, options);
	}

	/**
	 * Find by primary key
	 * @param {*} id - Primary key value
	 * @param {Object} options - Query options
	 * @returns {Promise<Object|null>}
	 */
	async findByPk(id, options = {}) {
		return await this.database.findByPk(this.modelName, id, options);
	}

	/**
	 * Update records
	 * @param {Object} data - Data to update
	 * @param {Object} options - Update options
	 * @returns {Promise<Array>}
	 */
	async update(data, options) {
		return await this.database.update(this.modelName, data, options);
	}

	/**
	 * Delete records
	 * @param {Object} options - Delete options
	 * @returns {Promise<number>}
	 */
	async destroy(options) {
		return await this.database.destroy(this.modelName, options);
	}

	/**
	 * Count records
	 * @param {Object} options - Count options
	 * @returns {Promise<number>}
	 */
	async count(options = {}) {
		return await this.database.count(this.modelName, options);
	}

	/**
	 * Get the underlying database model
	 * @returns {Object}
	 */
	getModel() {
		return this.database.getModel(this.modelName);
	}

	/**
	 * Execute a transaction
	 * @param {Function} callback - Transaction callback
	 * @returns {Promise<*>}
	 */
	async transaction(callback) {
		const transaction = await this.database.startTransaction();
		try {
			const result = await callback(transaction);
			await this.database.commitTransaction(transaction);
			return result;
		} catch (error) {
			await this.database.rollbackTransaction(transaction);
			throw error;
		}
	}

	/**
	 * Get model name
	 * @returns {string}
	 */
	getModelName() {
		return this.modelName;
	}

	/**
	 * Get database instance
	 * @returns {DatabaseInterface}
	 */
	getDatabase() {
		return this.database;
	}
}

module.exports = ModelBase;
