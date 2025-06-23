import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from './Header';
import { CartProvider } from '../../contexts/CartContext';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// Test wrapper with all necessary providers
const TestWrapper = ({ children, authValue = null }) => {
	const defaultAuthValue = {
		user: null,
		logout: jest.fn(),
		isAuthenticated: false,
		loading: false,
		error: null,
		userPermissions: {},
	};

	return (
		<BrowserRouter>
			<AuthProvider value={authValue || defaultAuthValue}>
				<CartProvider>
					{children}
				</CartProvider>
			</AuthProvider>
		</BrowserRouter>
	);
};

describe('Header Component', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
	});

	test('renders header with store title', () => {
		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Should render the app bar
		expect(screen.getByRole('banner')).toBeInTheDocument();
	});

	test('renders cart icon with item count', () => {
		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Should render shopping cart icon
		const cartButton = screen.getByLabelText(/shopping cart/i);
		expect(cartButton).toBeInTheDocument();
	});

	test('renders login button when user is not authenticated', () => {
		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Should render login button
		const loginButton = screen.getByText(/login/i);
		expect(loginButton).toBeInTheDocument();
	});

	test('renders user menu when user is authenticated', () => {
		const mockUser = {
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
			isAdmin: false,
		};

		const authValue = {
			user: mockUser,
			logout: jest.fn(),
			isAuthenticated: true,
			loading: false,
			error: null,
			userPermissions: {},
		};

		render(
			<TestWrapper authValue={authValue}>
				<Header />
			</TestWrapper>
		);

		// Should render user account icon
		const userButton = screen.getByLabelText(/account of current user/i);
		expect(userButton).toBeInTheDocument();
	});

	test('opens user menu when account icon is clicked', async () => {
		const mockUser = {
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
			isAdmin: false,
		};

		const authValue = {
			user: mockUser,
			logout: jest.fn(),
			isAuthenticated: true,
			loading: false,
			error: null,
			userPermissions: {},
		};

		render(
			<TestWrapper authValue={authValue}>
				<Header />
			</TestWrapper>
		);

		// Click on user account icon
		const userButton = screen.getByLabelText(/account of current user/i);
		fireEvent.click(userButton);

		// Should show user menu
		await waitFor(() => {
			expect(screen.getByText(/profile/i)).toBeInTheDocument();
		});
	});

	test('shows admin options for admin users', async () => {
		const mockAdminUser = {
			id: 1,
			username: 'admin',
			email: 'admin@example.com',
			isAdmin: true,
		};

		const authValue = {
			user: mockAdminUser,
			logout: jest.fn(),
			isAuthenticated: true,
			loading: false,
			error: null,
			userPermissions: {},
		};

		render(
			<TestWrapper authValue={authValue}>
				<Header />
			</TestWrapper>
		);

		// Click on user account icon
		const userButton = screen.getByLabelText(/account of current user/i);
		fireEvent.click(userButton);

		// Should show admin panel option
		await waitFor(() => {
			expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
		});
	});

	test('calls logout function when logout is clicked', async () => {
		const mockLogout = jest.fn();
		const mockUser = {
			id: 1,
			username: 'testuser',
			email: 'test@example.com',
			isAdmin: false,
		};

		const authValue = {
			user: mockUser,
			logout: mockLogout,
			isAuthenticated: true,
			loading: false,
			error: null,
			userPermissions: {},
		};

		render(
			<TestWrapper authValue={authValue}>
				<Header />
			</TestWrapper>
		);

		// Open user menu
		const userButton = screen.getByLabelText(/account of current user/i);
		fireEvent.click(userButton);

		// Click logout
		await waitFor(() => {
			const logoutButton = screen.getByText(/logout/i);
			fireEvent.click(logoutButton);
		});

		// Should call logout function
		expect(mockLogout).toHaveBeenCalled();
	});

	test('navigates to cart when cart icon is clicked', () => {
		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Click on cart icon
		const cartButton = screen.getByLabelText(/shopping cart/i);
		fireEvent.click(cartButton);

		// Should navigate to cart
		expect(mockNavigate).toHaveBeenCalledWith('/cart');
	});
});
