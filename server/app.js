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

// FIX: Simpler CORS configuration that won't reject preflight requests
app.use(cors({
	origin: function(origin, callback) {
		// Allow requests with no origin (like mobile apps)
		if(!origin) return callback(null, true);
		
		// Check against allowed origins
		if([
		'http://localhost:3000',
		'http://127.0.0.1:3000',
		process.env.REACT_APP_URL].indexOf(origin) !== -1){
			return callback(null, origin);
		}
		
		callback(null, false);  // Reject all other origins
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

// Alternative: If the above doesn't work, try this manual preflight handler
app.options('*', (req, res) => {
	const origin = req.headers.origin;
	const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
	
	if (allowedOrigins.includes(origin)) {
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		res.header('Access-Control-Allow-Credentials', 'true');
	}
	res.status(200).end();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Generate session secret
const sessionSecret = process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');

app.use(session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: 'lax' // Changed from dynamic to just 'lax' for simplicity
	}
}));

// Initialize passport configuration
require('./config/passport');
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
	res.status(500).json({ message: 'Something went wrong', error: process.env.NODE_ENV === 'development' ? err.message : 'Server error' });
});

module.exports = app;