/**
 * Sequelize Database Implementation
 * Implements the DatabaseInterface using Sequelize ORM
 */

const { Sequelize } = require('sequelize');
const DatabaseInterface = require('./DatabaseInterface');

class SequelizeDatabase extends DatabaseInterface {
	constructor(config) {
		super();
		this.config = config;
		this.sequelize = null;
		this.models = {};
		this.associations = {};
	}

	/**
	 * Connect to the database
	 */
	async connect() {
		try {
			// Create database if it doesn't exist (for MySQL)
			if (this.config.dialect === 'mysql' && this.config.autoCreateDatabase) {
				await this._createDatabaseIfNotExists();
			}

			// Initialize Sequelize
			if (this.config.url) {
				this.sequelize = new Sequelize(this.config.url, {
					logging: this.config.logging || false,
					pool: this.config.pool || {
						max: 10,
						min: 0,
						acquire: 30000,
						idle: 10000,
					},
				});
			} else {
				this.sequelize = new Sequelize(
					this.config.database,
					this.config.username,
					this.config.password,
					{
						host: this.config.host,
						port: this.config.port,
						dialect: this.config.dialect,
						logging: this.config.logging || false,
						pool: this.config.pool || {
							max: 10,
							min: 0,
							acquire: 30000,
							idle: 10000,
						},
					}
				);
			}

			// Test connection
			await this.sequelize.authenticate();
			console.log(`✅ ${this.config.dialect.toUpperCase()} connection established successfully`);
		} catch (error) {
			console.error('❌ Database connection failed:', error.message);
			throw error;
		}
	}

	/**
	 * Disconnect from the database
	 */
	async disconnect() {
		if (this.sequelize) {
			await this.sequelize.close();
			console.log('Database connection closed');
		}
	}

	/**
	 * Sync database schema
	 */
	async sync(options = {}) {
		if (!this.sequelize) {
			throw new Error('Database not connected');
		}

		await this.sequelize.sync(options);
		console.log('Database synchronized successfully');
	}

	/**
	 * Create database if it doesn't exist (for MySQL)
	 */
	async _createDatabaseIfNotExists() {
		if (this.config.dialect !== 'mysql') return;

		const mysql = require('mysql2/promise');
		const connection = await mysql.createConnection({
			host: this.config.host,
			user: this.config.username,
			password: this.config.password,
		});

		await connection.query(`CREATE DATABASE IF NOT EXISTS \`${this.config.database}\`;`);
		await connection.end();
	}

	/**
	 * Define a model
	 */
	defineModel(name, schema, options = {}) {
		if (!this.sequelize) {
			throw new Error('Database not connected');
		}

		const model = this.sequelize.define(name, schema, {
			timestamps: true,
			...options,
		});

		this.models[name] = model;
		return model;
	}

	/**
	 * Define model associations
	 */
	defineAssociations(associations) {
		this.associations = associations;

		// Apply associations
		Object.keys(associations).forEach(modelName => {
			const modelAssociations = associations[modelName];
			const model = this.models[modelName];

			if (!model) {
				console.warn(`Model ${modelName} not found for associations`);
				return;
			}

			Object.keys(modelAssociations).forEach(associationType => {
				const assocConfig = modelAssociations[associationType];

				if (Array.isArray(assocConfig)) {
					assocConfig.forEach(config => {
						this._applyAssociation(model, associationType, config);
					});
				} else {
					this._applyAssociation(model, associationType, assocConfig);
				}
			});
		});
	}

	/**
	 * Apply a single association
	 */
	_applyAssociation(model, type, config) {
		const targetModel = this.models[config.model];
		if (!targetModel) {
			console.warn(`Target model ${config.model} not found for association`);
			return;
		}

		switch (type) {
			case 'hasOne':
				model.hasOne(targetModel, config.options || {});
				break;
			case 'hasMany':
				model.hasMany(targetModel, config.options || {});
				break;
			case 'belongsTo':
				model.belongsTo(targetModel, config.options || {});
				break;
			case 'belongsToMany':
				model.belongsToMany(targetModel, config.options || {});
				break;
			default:
				console.warn(`Unknown association type: ${type}`);
		}
	}

	/**
	 * Create a new record
	 */
	async create(modelName, data) {
		const model = this.getModel(modelName);
		return await model.create(data);
	}

	/**
	 * Find all records
	 */
	async findAll(modelName, options = {}) {
		const model = this.getModel(modelName);
		return await model.findAll(options);
	}

	/**
	 * Find one record
	 */
	async findOne(modelName, options = {}) {
		const model = this.getModel(modelName);
		return await model.findOne(options);
	}

	/**
	 * Find by primary key
	 */
	async findByPk(modelName, id, options = {}) {
		const model = this.getModel(modelName);
		return await model.findByPk(id, options);
	}

	/**
	 * Update records
	 */
	async update(modelName, data, options) {
		const model = this.getModel(modelName);
		return await model.update(data, options);
	}

	/**
	 * Delete records
	 */
	async destroy(modelName, options) {
		const model = this.getModel(modelName);
		return await model.destroy(options);
	}

	/**
	 * Count records
	 */
	async count(modelName, options = {}) {
		const model = this.getModel(modelName);
		return await model.count(options);
	}

	/**
	 * Execute raw query
	 */
	async query(query, options = {}) {
		if (!this.sequelize) {
			throw new Error('Database not connected');
		}
		return await this.sequelize.query(query, options);
	}

	/**
	 * Start transaction
	 */
	async startTransaction() {
		if (!this.sequelize) {
			throw new Error('Database not connected');
		}
		return await this.sequelize.transaction();
	}

	/**
	 * Commit transaction
	 */
	async commitTransaction(transaction) {
		await transaction.commit();
	}

	/**
	 * Rollback transaction
	 */
	async rollbackTransaction(transaction) {
		await transaction.rollback();
	}

	/**
	 * Get model
	 */
	getModel(modelName) {
		const model = this.models[modelName];
		if (!model) {
			throw new Error(`Model ${modelName} not found`);
		}
		return model;
	}

	/**
	 * Get database type
	 */
	getType() {
		return 'sequelize';
	}

	/**
	 * Health check
	 */
	async healthCheck() {
		try {
			if (!this.sequelize) return false;
			await this.sequelize.authenticate();
			return true;
		} catch (error) {
			console.error('Database health check failed:', error.message);
			return false;
		}
	}

	/**
	 * Get Sequelize instance (for advanced operations)
	 */
	getSequelize() {
		return this.sequelize;
	}

	/**
	 * Get all models
	 */
	getAllModels() {
		return this.models;
	}
}

module.exports = SequelizeDatabase;
