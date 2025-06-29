/**
 * Database Factory
 * Creates appropriate database implementation based on configuration
 */

const SequelizeDatabase = require('./SequelizeDatabase');
const MongoDatabase = require('./MongoDatabase');

class DatabaseFactory {
	/**
	 * Create database instance based on type
	 * @param {Object} config - Database configuration
	 * @returns {DatabaseInterface} Database implementation instance
	 */
	static create(config) {
		if (!config || !config.type) {
			throw new Error('Database configuration must include a type');
		}

		switch (config.type.toLowerCase()) {
			case 'mysql':
			case 'postgres':
			case 'postgresql':
			case 'sqlite':
			case 'mariadb':
			case 'mssql':
				return new SequelizeDatabase({
					...config,
					dialect: config.type.toLowerCase() === 'postgres' ? 'postgres' : config.type.toLowerCase(),
				});

			case 'mongodb':
			case 'mongo':
				return new MongoDatabase(config);

			default:
				throw new Error(`Unsupported database type: ${config.type}`);
		}
	}

	/**
	 * Get supported database types
	 * @returns {Array<string>} List of supported database types
	 */
	static getSupportedTypes() {
		return [
			'mysql',
			'postgres',
			'postgresql',
			'sqlite',
			'mariadb',
			'mssql',
			'mongodb',
			'mongo',
		];
	}

	/**
	 * Validate configuration
	 * @param {Object} config - Database configuration
	 * @returns {boolean} True if valid
	 */
	static validateConfig(config) {
		if (!config || typeof config !== 'object') {
			throw new Error('Configuration must be an object');
		}

		if (!config.type) {
			throw new Error('Database type is required');
		}

		const supportedTypes = DatabaseFactory.getSupportedTypes();
		if (!supportedTypes.includes(config.type.toLowerCase())) {
			throw new Error(`Unsupported database type: ${config.type}. Supported types: ${supportedTypes.join(', ')}`);
		}

		// Type-specific validation
		switch (config.type.toLowerCase()) {
			case 'mysql':
			case 'postgres':
			case 'postgresql':
			case 'mariadb':
			case 'mssql':
				if (!config.url && (!config.host || !config.database)) {
					throw new Error('SQL databases require either a connection URL or host and database name');
				}
				break;

			case 'sqlite':
				if (!config.storage && !config.database) {
					throw new Error('SQLite requires either storage file path or database name');
				}
				break;

			case 'mongodb':
			case 'mongo':
				if (!config.url && (!config.host || !config.database)) {
					throw new Error('MongoDB requires either a connection URL or host and database name');
				}
				break;
		}

		return true;
	}

	/**
	 * Create configuration from environment variables
	 * @param {Object} env - Environment variables (process.env)
	 * @returns {Object} Database configuration
	 */
	static createConfigFromEnv(env = process.env) {
		const config = {
			type: env.DB_TYPE || env.DATABASE_TYPE || 'mysql',
		};

		// Common configuration
		if (env.DATABASE_URL) {
			config.url = env.DATABASE_URL;
		} else {
			config.host = env.DB_HOST || env.MYSQL_HOST || 'localhost';

			// Set default port based on database type
			let defaultPort = '3306'; // MySQL default
			if (['mongodb', 'mongo'].includes(config.type.toLowerCase())) {
				defaultPort = '27017'; // MongoDB default
			} else if (['postgres', 'postgresql'].includes(config.type.toLowerCase())) {
				defaultPort = '5432'; // PostgreSQL default
			}

			config.port = parseInt(env.DB_PORT || env.MYSQL_PORT || defaultPort);
			config.database = env.DB_NAME || env.MYSQL_DATABASE || 'ecommerce_db';
			config.username = env.DB_USER || env.MYSQL_USERNAME || 'root';
			config.password = env.DB_PASSWORD || env.MYSQL_PASSWORD || '';
		}

		// Additional options
		config.logging = env.DB_LOGGING === 'true' || env.NODE_ENV === 'development';
		config.autoCreateDatabase = env.DB_AUTO_CREATE !== 'false';

		// Pool configuration for SQL databases
		if (['mysql', 'postgres', 'postgresql', 'mariadb', 'mssql'].includes(config.type.toLowerCase())) {
			config.pool = {
				max: parseInt(env.DB_POOL_MAX || '10'),
				min: parseInt(env.DB_POOL_MIN || '0'),
				acquire: parseInt(env.DB_POOL_ACQUIRE || '30000'),
				idle: parseInt(env.DB_POOL_IDLE || '10000'),
			};
		}

		// MongoDB specific options
		if (['mongodb', 'mongo'].includes(config.type.toLowerCase())) {
			config.options = {
				maxPoolSize: parseInt(env.DB_POOL_MAX || '10'),
				minPoolSize: parseInt(env.DB_POOL_MIN || '0'),
				maxIdleTimeMS: parseInt(env.DB_POOL_IDLE || '10000'),
			};
		}

		return config;
	}
}

module.exports = DatabaseFactory;
