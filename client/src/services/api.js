import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Example API call to get products
export const fetchProducts = async () => {
	try {
		const response = await api.get('/products');
		return response.data;
	} catch (error) {
		throw new Error('Error fetching products: ' + error.message);
	}
};

// Example API call to create a new user
export const createUser = async (userData) => {
	try {
		const response = await api.post('/auth/register', userData);
		return response.data;
	} catch (error) {
		throw new Error('Error creating user: ' + error.message);
	}
};

// Example API call to login a user
export const loginUser = async (credentials) => {
	try {
		const response = await api.post('/auth/login', credentials);
		return response.data;
	} catch (error) {
		throw new Error('Error logging in: ' + error.message);
	}
};

// Add more API functions as needed

export default api;