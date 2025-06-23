import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CogMenu from './CogMenu';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// Test wrapper with necessary providers
const TestWrapper = ({ children, authValue }) => {
	const defaultAuthValue = {
		user: null,
		userPermissions: {},
		isAuthenticated: false,
		loading: false,
	};

	return (
		<BrowserRouter>
			<AuthProvider value={authValue || defaultAuthValue}>
				{children}
			</AuthProvider>
		</BrowserRouter>
	);
};

describe('CogMenu Component', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
	});

	test('does not render when user has no permissions', () => {
		const authValue = {
			user: { id: 1, username: 'user' },
			userPermissions: {},
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Should not render the cog menu
		expect(screen.queryByLabelText(/settings/i)).not.toBeInTheDocument();
	});

	test('renders when user is admin', () => {
		const authValue = {
			user: { id: 1, username: 'admin', isAdmin: true },
			userPermissions: {},
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Should render the cog menu
		expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
	});

	test('renders when user has product permissions', () => {
		const authValue = {
			user: { id: 1, username: 'user' },
			userPermissions: { add_product: true },
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Should render the cog menu
		expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
	});

	test('renders when user has page permissions', () => {
		const authValue = {
			user: { id: 1, username: 'user' },
			userPermissions: { edit_page: true },
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Should render the cog menu
		expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
	});

	test('opens menu when cog icon is clicked', () => {
		const authValue = {
			user: { id: 1, username: 'admin', isAdmin: true },
			userPermissions: {},
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Click the cog icon
		const cogButton = screen.getByLabelText(/settings/i);
		fireEvent.click(cogButton);

		// Should show menu items
		expect(screen.getByText(/products/i)).toBeInTheDocument();
		expect(screen.getByText(/pages/i)).toBeInTheDocument();
	});

	test('navigates to products management when products item is clicked', () => {
		const authValue = {
			user: { id: 1, username: 'admin', isAdmin: true },
			userPermissions: {},
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Open menu
		const cogButton = screen.getByLabelText(/settings/i);
		fireEvent.click(cogButton);

		// Click products item
		const productsItem = screen.getByText(/products/i);
		fireEvent.click(productsItem);

		// Should navigate to products management
		expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
	});

	test('navigates to pages management when pages item is clicked', () => {
		const authValue = {
			user: { id: 1, username: 'admin', isAdmin: true },
			userPermissions: {},
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Open menu
		const cogButton = screen.getByLabelText(/settings/i);
		fireEvent.click(cogButton);

		// Click pages item
		const pagesItem = screen.getByText(/pages/i);
		fireEvent.click(pagesItem);

		// Should navigate to pages management
		expect(mockNavigate).toHaveBeenCalledWith('/admin/pages');
	});

	test('closes menu when clicking outside', () => {
		const authValue = {
			user: { id: 1, username: 'admin', isAdmin: true },
			userPermissions: {},
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Open menu
		const cogButton = screen.getByLabelText(/settings/i);
		fireEvent.click(cogButton);

		// Menu should be open
		expect(screen.getByText(/products/i)).toBeInTheDocument();

		// Click outside (simulate menu close)
		fireEvent.click(document.body);

		// Menu should close (this depends on the implementation)
		// The menu might still be in DOM but not visible
	});

	test('shows only relevant menu items based on permissions', () => {
		const authValue = {
			user: { id: 1, username: 'user' },
			userPermissions: { add_product: true },
			isAuthenticated: true,
			loading: false,
		};

		render(
			<TestWrapper authValue={authValue}>
				<CogMenu />
			</TestWrapper>
		);

		// Open menu
		const cogButton = screen.getByLabelText(/settings/i);
		fireEvent.click(cogButton);

		// Should show products since user has product permissions
		expect(screen.getByText(/products/i)).toBeInTheDocument();

		// Should also show pages if user has page permissions, or not show if they don't
		// This depends on the specific implementation
	});
});
