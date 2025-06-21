// Load environment variables FIRST
require('dotenv').config();

// Import the properly configured Express app from app.js
const app = require('./app');

const PORT = process.env.PORT || 2048;

// Database connection and sync
const { connectDB } = require('./config/database');
const { syncDatabase } = require('./models');

// Database connection and sync
const startServer = async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');

        await syncDatabase();
        console.log('Database synchronized successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
            console.log(`API endpoints available at ${PORT}/api`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();