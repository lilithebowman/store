import axios from 'axios';
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Create axios instance with base URL
const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || 'http://localhost:2048/api',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Add request interceptor to include token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		console.log('Making request to:', config.baseURL + config.url);
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Add response interceptor for debugging
api.interceptors.response.use(
	(response) => {
		console.log('Response received:', response.status, response.data);
		return response;
	},
	(error) => {
		console.error('Response error:', error.response?.status, error.response?.data, error.message);
		return Promise.reject(error);
	}
);

export const login = async (email, password) => {
	try {
		console.log('Attempting login with:', { email, password: '***' });
		const response = await api.post('/auth/login', { email, password });
		return response.data;
	} catch (error) {
		console.error('Login error:', error);
		if (error.response) {
			// Server responded with error status
			throw error.response.data;
		} else if (error.request) {
			// Request made but no response received
			throw { message: 'No response from server. Check if server is running.' };
		} else {
			// Something else happened
			throw { message: error.message || 'Unknown error occurred' };
		}
	}
};

export const register = async (username, email, password) => {
	try {
		console.log('Attempting registration with:', { username, email, password: '***' });
		const response = await api.post('/auth/register', { username, email, password });
		return response.data;
	} catch (error) {
		console.error('Registration error:', error);
		if (error.response) {
			throw error.response.data;
		} else if (error.request) {
			throw { message: 'No response from server. Check if server is running.' };
		} else {
			throw { message: error.message || 'Unknown error occurred' };
		}
	}
};

export const logout = async () => {
	try {
		const response = await api.post('/auth/logout');
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return response.data;
	} catch (error) {
		console.error('Logout error:', error);
		localStorage.removeItem('token'); // Remove token even if server call fails
		localStorage.removeItem('user');
		if (error.response) {
			throw error.response.data;
		} else if (error.request) {
			throw { message: 'No response from server. Check if server is running.' };
		} else {
			throw { message: error.message || 'Unknown error occurred' };
		}
	}
};

// Simple JWT decode function for client-side use (no verification)
const decodeJWT = (token) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Error decoding JWT:', error);
		return null;
	}
};

// Get current user from stored token and user data
export const getCurrentUser = () => {
	const token = localStorage.getItem('token');
	if (!token) {
		return null;
	}

	try {
		// Decode JWT token to check expiration
		const payload = decodeJWT(token);

		if (!payload) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			return null;
		}

		// Check if token is expired
		if (payload.exp && payload.exp * 1000 < Date.now()) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			return null;
		}

		// Return user info from localStorage
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : { id: payload.id };
	} catch (error) {
		console.error('Error parsing token:', error);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return null;
	}
};

// Default export object with all methods
const authService = {
	login,
	register,
	logout,
	getCurrentUser
};

export default authService;

const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
	scope: ['profile', 'email']
}));

router.get('/google/callback',
	passport.authenticate('google', { session: false }),
	authController.oauthCallback
);

// Logout
router.post('/logout', authController.logout);

module.exports = router;

const authMiddleware = async (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ message: 'Access denied. No token provided.' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findByPk(decoded.id);

		if (!req.user) {
			return res.status(401).json({ message: 'User not found.' });
		}

		next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		res.status(400).json({ message: 'Invalid token.' });
	}
};

// Export both formats
module.exports = authMiddleware;
module.exports.authenticate = authMiddleware;