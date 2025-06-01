import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const currentUser = authService.getCurrentUser();
				if (currentUser) {
					setUser(currentUser);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error('Error fetching user:', error);
				setIsAuthenticated(false);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const handleLogin = async (email, password) => {
		try {
			setError(null);
			const response = await authService.login(email, password);
			setUser(response.user);
			localStorage.setItem('token', response.token);
			localStorage.setItem('user', JSON.stringify(response.user));
			setIsAuthenticated(true);
			return response;
		} catch (error) {
			console.error('Login failed:', error);
			setError(error.message || 'Login failed');
			setIsAuthenticated(false);
			throw error;
		}
	};

	const register = async userData => {
		try {
			setError(null);
			const response = await authService.register(
				userData.username,
				userData.email,
				userData.password
			);
			// Registration doesn't return user data, so redirect to login
			setError(null);
			return response;
		} catch (error) {
			console.error('Registration failed:', error);
			setError(error.message || 'Registration failed');
			throw error;
		}
	};

	const logout = async () => {
		try {
			await authService.logout();
			setUser(null);
			setIsAuthenticated(false);
			setError(null);
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		} catch (error) {
			console.error('Logout failed:', error);
			// Still clear local state even if server call fails
			setUser(null);
			setIsAuthenticated(false);
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
	};

	// Alias for compatibility
	const login = handleLogin;

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				error,
				isAuthenticated,
				handleLogin,
				login,
				register,
				logout,
			}}
		>
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
	isAuthenticated: PropTypes.bool.isRequired,
	error: PropTypes.string,
	handleLogin: PropTypes.func.isRequired,
	login: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	logout: PropTypes.func.isRequired,
};
