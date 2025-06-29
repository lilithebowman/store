// Test MongoDB connection
require('dotenv').config({ path: '../.env' });

const { connectDB } = require('./config/database');

async function testConnection() {
	try {
		console.log('Testing database connection...');
		console.log('DB_TYPE:', process.env.DB_TYPE);
		console.log('DB_HOST:', process.env.DB_HOST);
		console.log('DB_PORT:', process.env.DB_PORT);

		await connectDB();
		console.log('✅ Database connection successful!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Database connection failed:', error.message);
		process.exit(1);
	}
}

testConnection();
