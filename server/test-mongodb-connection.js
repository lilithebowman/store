// Test MongoDB connection
require('dotenv').config({ path: '../.env' });

const { databaseManager } = require('./config/database');

async function testConnection() {
	try {
		console.log('🚀 Testing MongoDB connection...');
		console.log('Environment variables:');
		console.log('  DB_TYPE:', process.env.DB_TYPE);
		console.log('  DB_HOST:', process.env.DB_HOST);
		console.log('  DB_PORT:', process.env.DB_PORT);
		console.log('  DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

		await databaseManager.initialize();
		console.log('✅ MongoDB connection successful!');

		// Test health check
		const isHealthy = await databaseManager.healthCheck();
		console.log('🏥 Health check:', isHealthy ? 'Passed' : 'Failed');

		process.exit(0);
	} catch (error) {
		console.error('❌ Connection failed:', error.message);
		console.error('Stack:', error.stack);
		process.exit(1);
	}
}

testConnection();
