/**
 * MongoDB Database Implementation
 * Implements the DatabaseInterface using Mongoose ODM
 */

const mongoose = require('mongoose');
const DatabaseInterface = require('./DatabaseInterface');

class MongoDatabase extends DatabaseInterface {
	constructor(config) {
		super();
		this.config = config;
		this.mongoose = mongoose;
		this.models = {};
		this.schemas = {};
	}

	/**
	 * Connect to MongoDB
	 */
	async connect() {
		try {
			const connectionString = this.config.url ||
				`mongodb://${this.config.host}:${this.config.port}/${this.config.database}`;

			await this.mongoose.connect(connectionString, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				...this.config.options,
			});

			console.log('✅ MongoDB connection established successfully');
		} catch (error) {
			console.error('❌ MongoDB connection failed:', error.message);
			throw error;
		}
	}

	/**
	 * Disconnect from MongoDB
	 */
	async disconnect() {
		await this.mongoose.disconnect();
		console.log('MongoDB connection closed');
	}

	/**
	 * Sync database (MongoDB doesn't require schema sync)
	 */
	async sync(options = {}) {
		// MongoDB is schemaless, but we can create indexes here if needed
		for (const modelName of Object.keys(this.models)) {
			const model = this.models[modelName];
			if (model.createIndexes) {
				await model.createIndexes();
			}
		}
		console.log('MongoDB indexes synchronized successfully');
	}

	/**
	 * Define a model
	 */
	defineModel(name, schemaDefinition, options = {}) {
		const schema = new mongoose.Schema(schemaDefinition, {
			timestamps: true,
			...options,
		});

		this.schemas[name] = schema;
		this.models[name] = this.mongoose.model(name, schema);
		return this.models[name];
	}

	/**
	 * Define model associations (references in MongoDB)
	 */
	defineAssociations(associations) {
		// In MongoDB, associations are typically handled through references
		// This is a simplified implementation
		Object.keys(associations).forEach(modelName => {
			const schema = this.schemas[modelName];
			const modelAssociations = associations[modelName];

			if (!schema) {
				console.warn(`Schema ${modelName} not found for associations`);
				return;
			}

			// Add reference fields based on associations
			Object.keys(modelAssociations).forEach(associationType => {
				const assocConfig = modelAssociations[associationType];
				this._applyMongoAssociation(schema, associationType, assocConfig);
			});
		});
	}

	/**
	 * Apply MongoDB association (add reference fields)
	 */
	_applyMongoAssociation(schema, type, config) {
		const configs = Array.isArray(config) ? config : [config];

		configs.forEach(conf => {
			switch (type) {
				case 'belongsTo':
					schema.add({
						[conf.field || `${conf.model.toLowerCase()}Id`]: {
							type: mongoose.Schema.Types.ObjectId,
							ref: conf.model,
						}
					});
					break;
				case 'hasMany':
					// Typically handled on the other side in MongoDB
					break;
				case 'belongsToMany':
					schema.add({
						[conf.field || `${conf.model.toLowerCase()}s`]: [{
							type: mongoose.Schema.Types.ObjectId,
							ref: conf.model,
						}]
					});
					break;
			}
		});
	}

	/**
	 * Create a new record
	 */
	async create(modelName, data) {
		const model = this.getModel(modelName);
		const document = new model(data);
		return await document.save();
	}

	/**
	 * Find all records
	 */
	async findAll(modelName, options = {}) {
		const model = this.getModel(modelName);
		let query = model.find(options.where || {});

		if (options.include) {
			// Handle population for MongoDB
			if (Array.isArray(options.include)) {
				options.include.forEach(pop => {
					query = query.populate(pop);
				});
			} else {
				query = query.populate(options.include);
			}
		}

		if (options.order) {
			const sort = {};
			options.order.forEach(([field, direction]) => {
				sort[field] = direction.toLowerCase() === 'desc' ? -1 : 1;
			});
			query = query.sort(sort);
		}

		if (options.limit) {
			query = query.limit(options.limit);
		}

		if (options.offset) {
			query = query.skip(options.offset);
		}

		return await query.exec();
	}

	/**
	 * Find one record
	 */
	async findOne(modelName, options = {}) {
		const model = this.getModel(modelName);
		let query = model.findOne(options.where || {});

		if (options.include) {
			if (Array.isArray(options.include)) {
				options.include.forEach(pop => {
					query = query.populate(pop);
				});
			} else {
				query = query.populate(options.include);
			}
		}

		return await query.exec();
	}

	/**
	 * Find by primary key (MongoDB uses _id)
	 */
	async findByPk(modelName, id, options = {}) {
		const model = this.getModel(modelName);
		let query = model.findById(id);

		if (options.include) {
			if (Array.isArray(options.include)) {
				options.include.forEach(pop => {
					query = query.populate(pop);
				});
			} else {
				query = query.populate(options.include);
			}
		}

		return await query.exec();
	}

	/**
	 * Update records
	 */
	async update(modelName, data, options) {
		const model = this.getModel(modelName);
		const result = await model.updateMany(options.where || {}, data);
		return [result.modifiedCount, []]; // Return format similar to Sequelize
	}

	/**
	 * Delete records
	 */
	async destroy(modelName, options) {
		const model = this.getModel(modelName);
		const result = await model.deleteMany(options.where || {});
		return result.deletedCount;
	}

	/**
	 * Count records
	 */
	async count(modelName, options = {}) {
		const model = this.getModel(modelName);
		return await model.countDocuments(options.where || {});
	}

	/**
	 * Execute raw query (MongoDB aggregation)
	 */
	async query(pipeline, options = {}) {
		const { model: modelName } = options;
		if (!modelName) {
			throw new Error('Model name required for MongoDB queries');
		}

		const model = this.getModel(modelName);
		return await model.aggregate(pipeline);
	}

	/**
	 * Start transaction
	 */
	async startTransaction() {
		const session = await this.mongoose.startSession();
		session.startTransaction();
		return session;
	}

	/**
	 * Commit transaction
	 */
	async commitTransaction(session) {
		await session.commitTransaction();
		session.endSession();
	}

	/**
	 * Rollback transaction
	 */
	async rollbackTransaction(session) {
		await session.abortTransaction();
		session.endSession();
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
		return 'mongodb';
	}

	/**
	 * Health check
	 */
	async healthCheck() {
		try {
			return this.mongoose.connection.readyState === 1;
		} catch (error) {
			console.error('MongoDB health check failed:', error.message);
			return false;
		}
	}

	/**
	 * Get Mongoose instance
	 */
	getMongoose() {
		return this.mongoose;
	}

	/**
	 * Get all models
	 */
	getAllModels() {
		return this.models;
	}
}

module.exports = MongoDatabase;
