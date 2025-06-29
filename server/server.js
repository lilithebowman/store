// Load environment variables FIRST
require("dotenv").config({ path: '../.env' });

// Import the properly configured Express app from app.js
const app = require("./app");

const PORT = process.env.PORT || 2048;

// Database connection and sync
const { connectDB } = require("./config/database");
const { syncDatabase } = require("./models");

// Database connection and sync
const startServer = async () => {
	try {
		console.log('🚀 Starting server...');
		console.log('📊 Environment variables:');
		console.log('   DB_TYPE:', process.env.DB_TYPE);
		console.log('   DB_HOST:', process.env.DB_HOST);
		console.log('   DB_PORT:', process.env.DB_PORT);
		console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

		console.log('📡 Connecting to database...');
		await connectDB();
		console.log("✅ Database connected successfully");

		console.log('🔄 Synchronizing database...');
		await syncDatabase();
		console.log("✅ Database synchronized successfully");

		app.listen(PORT, () => {
			console.log(`🌐 Server is running on port ${PORT}`);
			console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
		});
	} catch (err) {
		console.error("❌ Error starting server:", err);
		process.exit(1);
	}
};

startServer();
