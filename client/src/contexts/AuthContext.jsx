import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const currentUser = authService.getCurrentUser();
				setUser(currentUser);
			} catch (error) {
				console.error('Error fetching user:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const login = async (credentials) => {
		const loggedInUser = await authService.login(credentials);
		setUser(loggedInUser);
	};

	const register = async (userData) => {
		const newUser = await authService.register(userData);
		setUser(newUser);
	};

	const logout = async () => {
		authService.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

// Props Validation
AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

AuthContext.propTypes = {
	user: PropTypes.object,
	loading: PropTypes.bool.isRequired,
	login: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
};