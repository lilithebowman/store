const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();

// Load environment variables first
require('dotenv').config();

// Ensure JWT_SECRET is available
if (!process.env.JWT_SECRET) {
	console.error('CRITICAL: JWT_SECRET environment variable is not set!');
	console.error('Please create a .env file with a secure JWT_SECRET');
	process.exit(1); // Don't start server without proper secrets
}

// Ensure SESSION_SECRET is available
if (!process.env.SESSION_SECRET) {
	console.error('CRITICAL: SESSION_SECRET environment variable is not set!');
	console.error('Please create a .env file with a secure SESSION_SECRET');
	process.exit(1); // Don't start server without proper secrets
}

// Middleware
app.use(cors({
	origin: function (origin, callback) {
		const allowedOrigins = [
			'http://localhost:3000',
			'http://127.0.0.1:3000',
			'http://mouse:3000',          // Your frontend origin
			'http://mouse:2048',          // Your backend origin
			'http://localhost:2048'
		];

		console.log('CORS request from origin:', origin); // Debug logging

		// Allow requests with no origin (like curl, Postman, or server-to-server)
		if (!origin) return callback(null, allowedOrigins[0]);
		if (allowedOrigins.includes(origin)) {
			console.log('CORS: Origin allowed:', origin);
			return callback(null, origin);
		} else {
			console.log('CORS: Origin blocked:', origin);
			return callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	}
}));
app.use(passport.initialize());
app.use(passport.session());

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

module.exports = app;