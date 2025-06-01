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
		return response.data;
	} catch (error) {
		console.error('Logout error:', error);
		localStorage.removeItem('token'); // Remove token even if server call fails
		if (error.response) {
			throw error.response.data;
		} else if (error.request) {
			throw { message: 'No response from server. Check if server is running.' };
		} else {
			throw { message: error.message || 'Unknown error occurred' };
		}
	}
};

// Add the missing getCurrentUser method
export const getCurrentUser = () => {
	const token = localStorage.getItem('token');
	if (!token) {
		return null;
	}

	try {
		// Decode JWT token to get user info
		const payload = JSON.parse(atob(token.split('.')[1]));

		// Check if token is expired
		if (payload.exp * 1000 < Date.now()) {
			localStorage.removeItem('token');
			return null;
		}

		// Return user info from token or stored user data
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : { id: payload.id };
	} catch (error) {
		console.error('Error parsing token:', error);
		localStorage.removeItem('token');
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