import axios from 'axios';
import { SecureAuth } from '../utils/secureAuth';

// Create axios instance with base URL
const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL || `http://${window.location.hostname}:2048/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Add request interceptor to include token
api.interceptors.request.use(
	(config) => {
		const token = SecureAuth.getToken(); // Use secure token retrieval
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
		console.log('Response data:', response.data);

		// Store token and user data securely
		if (response.data && response.data.token) {
			SecureAuth.setToken(response.data.token);
		}
		if (response.data && response.data.user) {
			SecureAuth.setUserData(response.data.user);
		}

		return response.data;
	} catch (error) {
		// Don't log sensitive data in production
		if (process.env.NODE_ENV === 'development') {
			console.error('Login error details:', {
				message: error.message,
				status: error.response?.status,
				// Don't log full response data which might contain sensitive info
			});
		}

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
			SecureAuth.setToken(response.data.token);
		}
		if (response.data.user) {
			SecureAuth.setUserData(response.data.user);
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
		SecureAuth.clearAuth(); // Use secure clear method
	}
};

export const getCurrentUser = () => {
	const token = SecureAuth.getToken();
	if (!token) {
		return null;
	}

	// Return user data from secure storage
	return SecureAuth.getUserData();
};

export const updateProfileImage = async (imageFile) => {
	try {
		const formData = new FormData();
		formData.append('profileImage', imageFile);

		// Don't set Content-Type manually - let axios set it automatically for FormData
		// This preserves the Authorization header from the interceptor
		const response = await api.put('/users/profile/image', formData);

		// Update stored user data
		if (response.data.user) {
			SecureAuth.setUserData(response.data.user);
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

// Default export
const authService = {
	login,
	register,
	logout,
	getCurrentUser,
	updateProfileImage
};

export default authService;