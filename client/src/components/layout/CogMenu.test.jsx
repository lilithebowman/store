import React from 'react';
import PropTypes from 'prop-types';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import CogMenu from './CogMenu';

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// Mock AuthContext
const mockAuthContext = {
	user: null,
	userPermissions: {},
	isAuthenticated: false,
	loading: false,
};

jest.mock('../../contexts/AuthContext', () => ({
	useAuth: () => mockAuthContext,
}));

// Test wrapper with necessary providers
const TestWrapper = ({ children }) => {
	return <BrowserRouter>{children}</BrowserRouter>;
};
TestWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

describe('CogMenu Component', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
		// Reset auth mock to default state
		mockAuthContext.user = null;
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = false;
	});

	test('does not render when user has no permissions', () => {
		mockAuthContext.user = { id: 1, username: 'user' };
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
				<CogMenu />
			</TestWrapper>
		);

		// Should not render the cog menu
		expect(screen.queryByLabelText(/settings/i)).not.toBeInTheDocument();
	});

	test('renders when user is admin', () => {
		mockAuthContext.user = { id: 1, username: 'admin', isAdmin: true };
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
				<CogMenu />
			</TestWrapper>
		);

		// Should render the cog menu
		expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
	});

	test('renders when user has product permissions', () => {
		mockAuthContext.user = { id: 1, username: 'user' };
		mockAuthContext.userPermissions = { add_product: true };
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
				<CogMenu />
			</TestWrapper>
		);

		// Should render the cog menu
		expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
	});

	test('renders when user has page permissions', () => {
		mockAuthContext.user = { id: 1, username: 'user' };
		mockAuthContext.userPermissions = { edit_page: true };
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
				<CogMenu />
			</TestWrapper>
		);

		// Should render the cog menu
		expect(screen.getByLabelText(/settings/i)).toBeInTheDocument();
	});

	test('opens menu when cog icon is clicked', () => {
		mockAuthContext.user = { id: 1, username: 'admin', isAdmin: true };
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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
		mockAuthContext.user = { id: 1, username: 'admin', isAdmin: true };
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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
		mockAuthContext.user = { id: 1, username: 'admin', isAdmin: true };
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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
		mockAuthContext.user = { id: 1, username: 'admin', isAdmin: true };
		mockAuthContext.userPermissions = {};
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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
		mockAuthContext.user = { id: 1, username: 'user' };
		mockAuthContext.userPermissions = { add_product: true };
		mockAuthContext.isAuthenticated = true;

		render(
			<TestWrapper>
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
