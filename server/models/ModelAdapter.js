/**
 * Model Adapter
 * Provides a unified interface for models across different database types
 */

const { databaseManager } = require('../config/database');

class ModelAdapter {
	constructor(modelName) {
		this.modelName = modelName;
		this.databaseManager = databaseManager;
	}

	/**
	 * Get the underlying database model
	 */
	getModel() {
		return this.databaseManager.getModel(this.modelName);
	}

	/**
	 * Get database type
	 */
	getDatabaseType() {
		return this.databaseManager.getDatabaseType();
	}

	/**
	 * Create a new record
	 */
	async create(data) {
		const database = this.databaseManager.getDatabase();
		return await database.create(this.modelName, data);
	}

	/**
	 * Find all records
	 */
	async findAll(options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.findAll(this.modelName, options);
	}

	/**
	 * Find one record
	 */
	async findOne(options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.findOne(this.modelName, options);
	}

	/**
	 * Find by primary key
	 */
	async findByPk(id, options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.findByPk(this.modelName, id, options);
	}

	/**
	 * Update records
	 */
	async update(data, options) {
		const database = this.databaseManager.getDatabase();
		return await database.update(this.modelName, data, options);
	}

	/**
	 * Delete records
	 */
	async destroy(options) {
		const database = this.databaseManager.getDatabase();
		return await database.destroy(this.modelName, options);
	}

	/**
	 * Count records
	 */
	async count(options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.count(this.modelName, options);
	}

	/**
	 * Create multiple records
	 */
	async bulkCreate(data, options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.bulkCreate(this.modelName, data, options);
	}
}

// Export model adapters for each model type
const createModelAdapter = (modelName) => {
	return new ModelAdapter(modelName);
};

// Special User model adapter with additional methods
class UserModelAdapter extends ModelAdapter {
	constructor() {
		super('User');
	}

	/**
	 * Override methods to return native Mongoose documents with built-in comparePassword
	 */
	async findOne(options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.findOne(this.modelName, options);
	}

	async findByPk(id, options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.findByPk(this.modelName, id, options);
	}

	async findAll(options = {}) {
		const database = this.databaseManager.getDatabase();
		return await database.findAll(this.modelName, options);
	}

	async create(data) {
		const database = this.databaseManager.getDatabase();
		return await database.create(this.modelName, data);
	}
}

module.exports = {
	ModelAdapter,
	createModelAdapter,
	// Create specific model adapters
	User: new UserModelAdapter(),
	Product: createModelAdapter('Product'),
	Order: createModelAdapter('Order'),
	Page: createModelAdapter('Page'),
	Role: createModelAdapter('Role'),
};
