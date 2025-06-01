const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2048;
// Generate a random session secret if not provided
const sessionSecret = process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: process.env.SESSION_SECRET || sessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

module.exports = app;

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
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`API endpoints available at http://localhost:${PORT}/api`);
        });
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

startServer();