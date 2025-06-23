import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the components and contexts
jest.mock('./contexts/AuthContext', () => ({
	AuthProvider: ({ children }) => (
		<div data-testid="auth-provider">{children}</div>
	),
}));

jest.mock('./contexts/CartContext', () => ({
	CartProvider: ({ children }) => (
		<div data-testid="cart-provider">{children}</div>
	),
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
	BrowserRouter: ({ children }) => (
		<div data-testid="browser-router">{children}</div>
	),
	Routes: ({ children }) => <div data-testid="routes">{children}</div>,
	Route: ({ path, element }) => (
		<div
			data-testid={`route-${path?.replace(/[^a-zA-Z0-9]/g, '_') || 'default'}`}
		>
			{element}
		</div>
	),
}));

// Mock page components
jest.mock('./pages', () => ({
	Home: () => <div data-testid="home-page">Home Page</div>,
	Auth: () => <div data-testid="auth-page">Auth Page</div>,
	Cart: () => <div data-testid="cart-page">Cart Page</div>,
	Checkout: () => <div data-testid="checkout-page">Checkout Page</div>,
	Product: () => <div data-testid="product-page">Product Page</div>,
	Profile: () => <div data-testid="profile-page">Profile Page</div>,
	UserManagement: () => (
		<div data-testid="user-management-page">User Management Page</div>
	),
	RoleManagement: () => (
		<div data-testid="role-management-page">Role Management Page</div>
	),
	ProductManagement: () => (
		<div data-testid="product-management-page">Product Management Page</div>
	),
	PageManagement: () => (
		<div data-testid="page-management-page">Page Management Page</div>
	),
	PageEditor: () => (
		<div data-testid="page-editor-page">Page Editor Page</div>
	),
	Page: () => <div data-testid="dynamic-page">Dynamic Page</div>,
}));

// Mock layout components
jest.mock('./components/layout/Header', () => {
	return function Header() {
		return <div data-testid="header">Header</div>;
	};
});

jest.mock('./components/layout/Footer', () => {
	return function Footer() {
		return <div data-testid="footer">Footer</div>;
	};
});

// Mock MUI theme provider
jest.mock('@mui/material/styles', () => ({
	ThemeProvider: ({ children }) => (
		<div data-testid="theme-provider">{children}</div>
	),
}));

jest.mock('./theme', () => ({
	default: {},
}));

describe('App Component', () => {
	test('renders without crashing', () => {
		render(<App />);

		// Should render the main app structure
		expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
		expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
		expect(screen.getByTestId('cart-provider')).toBeInTheDocument();
		expect(screen.getByTestId('browser-router')).toBeInTheDocument();
	});

	test('renders header and footer', () => {
		render(<App />);

		expect(screen.getByTestId('header')).toBeInTheDocument();
		expect(screen.getByTestId('footer')).toBeInTheDocument();
	});

	test('renders routing structure', () => {
		render(<App />);

		expect(screen.getByTestId('routes')).toBeInTheDocument();
	});

	test('renders all route components', () => {
		render(<App />);

		// Check for various route components
		expect(screen.getByTestId('home-page')).toBeInTheDocument();
		expect(screen.getByTestId('auth-page')).toBeInTheDocument();
		expect(screen.getByTestId('cart-page')).toBeInTheDocument();
		expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
		expect(screen.getByTestId('product-page')).toBeInTheDocument();
		expect(screen.getByTestId('profile-page')).toBeInTheDocument();
	});

	test('renders admin route components', () => {
		render(<App />);

		expect(screen.getByTestId('user-management-page')).toBeInTheDocument();
		expect(screen.getByTestId('role-management-page')).toBeInTheDocument();
		expect(
			screen.getByTestId('product-management-page')
		).toBeInTheDocument();
		expect(screen.getByTestId('page-management-page')).toBeInTheDocument();
		expect(screen.getByTestId('page-editor-page')).toBeInTheDocument();
	});

	test('provides necessary context providers', () => {
		render(<App />);

		// Should wrap components with required providers
		const authProvider = screen.getByTestId('auth-provider');
		const cartProvider = screen.getByTestId('cart-provider');

		expect(authProvider).toBeInTheDocument();
		expect(cartProvider).toBeInTheDocument();
	});

	test('applies theme provider', () => {
		render(<App />);

		expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
	});

	test('renders with proper component hierarchy', () => {
		render(<App />);

		const themeProvider = screen.getByTestId('theme-provider');
		const authProvider = screen.getByTestId('auth-provider');
		const cartProvider = screen.getByTestId('cart-provider');
		const browserRouter = screen.getByTestId('browser-router');

		// Check that providers are nested correctly
		expect(themeProvider).toContainElement(authProvider);
		expect(authProvider).toContainElement(cartProvider);
		expect(cartProvider).toContainElement(browserRouter);
	});
});
