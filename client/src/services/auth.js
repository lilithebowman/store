import axios from 'axios';

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
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const login = async (email, password) => {
	try {
		console.log('Login request starting...');
		const response = await api.post('/auth/login', { email, password });

		console.log('Response status:', response.status);
		console.log('Response headers:', response.headers);
		console.log('Response data:', response.data);

		// Store token and user data if they exist
		if (response.data && response.data.token) {
			localStorage.setItem('token', response.data.token);
		}
		if (response.data && response.data.user) {
			localStorage.setItem('user', JSON.stringify(response.data.user));
		}

		return response.data;
	} catch (error) {
		console.error('Login error details:', {
			message: error.message,
			response: error.response ? {
				status: error.response.status,
				data: error.response.data,
				headers: error.response.headers
			} : 'No response',
			request: error.request ? 'Request was made but no response received' : 'No request'
		});

		if (error.response) {
			throw error.response.data || { message: `Server error: ${error.response.status}` };
		} else if (error.request) {
			throw { message: 'No response from server. Check if server is running.' };
		} else {
			throw { message: error.message || 'Unknown error occurred' };
		}
	}
};

export const register = async (username, email, password) => {
	try {
		const response = await api.post('/auth/register', { username, email, password });
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('user', JSON.stringify(response.data.user));
		}
		return response.data;
	} catch (error) {
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
		await api.post('/auth/logout');
	} catch (error) {
		console.error('Logout error:', error);
	} finally {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	}
};

// Simple JWT decode function for client-side use
const decodeJWT = (token) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		return JSON.parse(jsonPayload);
	} catch (error) {
		return null;
	}
};

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
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return null;
	}
};

// Default export
const authService = {
	login,
	register,
	logout,
	getCurrentUser
};

export default authService;