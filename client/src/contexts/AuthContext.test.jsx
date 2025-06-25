import React from 'react';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Mock the auth service
jest.mock('../services/auth', () => ({
	login: jest.fn(),
	register: jest.fn(),
	logout: jest.fn(),
	getCurrentUser: jest.fn(),
	updateProfileImage: jest.fn(),
	getUserPermissions: jest.fn(),
}));

// Test component to use the AuthContext
const TestComponent = () => {
	const {
		user,
		isAuthenticated,
		loading,
		error,
		login,
		register,
		logout,
		updateProfileImage,
		userPermissions,
	} = useAuth();

	return (
		<div>
			<div data-testid="user">{user ? user.username : 'No user'}</div>
			<div data-testid="authenticated">
				{isAuthenticated ? 'true' : 'false'}
			</div>
			<div data-testid="loading">{loading ? 'true' : 'false'}</div>
			<div data-testid="error">{error || 'No error'}</div>
			<div data-testid="permissions">
				{JSON.stringify(userPermissions)}
			</div>
			<button onClick={() => login('test@example.com', 'password')}>
				Login
			</button>
			<button
				onClick={() =>
					register('testuser', 'test@example.com', 'password')
				}
			>
				Register
			</button>
			<button onClick={logout}>Logout</button>
			<button
				onClick={() => updateProfileImage(new File([''], 'test.jpg'))}
			>
				Update Image
			</button>
		</div>
	);
};

describe('AuthContext', () => {
	const authService = require('../services/auth');

	beforeEach(() => {
		jest.clearAllMocks();
		// Mock localStorage
		Object.defineProperty(window, 'localStorage', {
			value: {
				getItem: jest.fn(),
				setItem: jest.fn(),
				removeItem: jest.fn(),
			},
			writable: true,
		});
	});

	test('provides default auth context values', () => {
		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		expect(screen.getByTestId('user')).toHaveTextContent('No user');
		expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
		expect(screen.getByTestId('loading')).toHaveTextContent('false'); // Loading becomes false after useEffect
		expect(screen.getByTestId('error')).toHaveTextContent('No error');
		expect(screen.getByTestId('permissions')).toHaveTextContent('{}');
	});

	test('handles successful login', async () => {
		const mockUser = {
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
		};

		authService.login.mockResolvedValue(mockUser);
		authService.getUserPermissions.mockResolvedValue({});

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Click login button
		fireEvent.click(screen.getByText('Login'));

		await waitFor(() => {
			expect(authService.login).toHaveBeenCalledWith(
				'test@example.com',
				'password'
			);
		});
	});

	test('handles login error', async () => {
		const errorMessage = 'Login failed';
		authService.login.mockRejectedValue(new Error(errorMessage));

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Click login button
		await act(async () => {
			fireEvent.click(screen.getByText('Login'));
		});

		await waitFor(() => {
			expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
		});
		expect(screen.getByTestId('isAuthenticated')).toHaveTextContent(
			'false'
		);
	});

	test('handles successful registration', async () => {
		const mockResponse = { message: 'Registration successful' };

		authService.register.mockResolvedValue(mockResponse);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Click register button
		fireEvent.click(screen.getByText('Register'));

		await waitFor(() => {
			expect(authService.register).toHaveBeenCalledWith(
				'testuser',
				'test@example.com',
				'password'
			);
		});

		// Should not automatically log in after registration
		expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
	});

	test('handles logout', async () => {
		authService.logout.mockResolvedValue();

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Click logout button
		fireEvent.click(screen.getByText('Logout'));

		await waitFor(() => {
			expect(authService.logout).toHaveBeenCalled();
		});
	});

	test('handles profile image update', async () => {
		const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
		const mockResponse = { success: true };

		authService.updateProfileImage.mockResolvedValue(mockResponse);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		// Click update image button
		fireEvent.click(screen.getByText('Update Image'));

		await waitFor(() => {
			expect(authService.updateProfileImage).toHaveBeenCalledWith(
				mockFile
			);
		});
	});

	test('throws error when useAuth is used outside AuthProvider', () => {
		// Suppress console.error for this test
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => {
			render(<TestComponent />);
		}).toThrow('useAuth must be used within an AuthProvider');

		consoleSpy.mockRestore();
	});
});
