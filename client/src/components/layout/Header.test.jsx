import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from './Header';
import { CartProvider } from '../../contexts/CartContext';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockAuthContext = {
	user: null,
	logout: jest.fn(),
	isAuthenticated: false,
	loading: false,
	error: null,
	userPermissions: {},
};

jest.mock('../../contexts/AuthContext', () => ({
	useAuth: () => mockAuthContext,
}));

// Test wrapper with all necessary providers
const TestWrapper = ({ children }) => {
	return (
		<BrowserRouter>
			<CartProvider>{children}</CartProvider>
		</BrowserRouter>
	);
};
TestWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

describe('Header Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// Reset auth mock to default state
		mockAuthContext.user = null;
		mockAuthContext.isAuthenticated = false;
		mockAuthContext.logout = jest.fn();
		mockAuthContext.userPermissions = {};
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

		// Update the mock for this test
		mockAuthContext.user = mockUser;
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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

		// Update the mock for this test
		mockAuthContext.user = mockUser;
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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

		// Update the mock for this test
		mockAuthContext.user = mockAdminUser;
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Click on user account icon
		const userButton = screen.getByLabelText(/account of current user/i);
		fireEvent.click(userButton);

		// Should show admin options
		await waitFor(() => {
			expect(screen.getByText(/user management/i)).toBeInTheDocument();
			expect(screen.getByText(/roles/i)).toBeInTheDocument();
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

		// Update the mock for this test
		mockAuthContext.user = mockUser;
		mockAuthContext.isAuthenticated = true;
		mockAuthContext.logout = mockLogout;

		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Open user menu
		const userButton = screen.getByLabelText(/account of current user/i);
		fireEvent.click(userButton);

		// Click logout
		const logoutButton = await screen.findByText(/logout/i);
		fireEvent.click(logoutButton);

		// Should call logout function
		expect(mockLogout).toHaveBeenCalled();
	});

	test('cart icon has correct link', () => {
		render(
			<TestWrapper>
				<Header />
			</TestWrapper>
		);

		// Check cart icon link
		const cartButton = screen.getByLabelText(/shopping cart/i);
		expect(cartButton).toHaveAttribute('href', '/cart');
	});
});
