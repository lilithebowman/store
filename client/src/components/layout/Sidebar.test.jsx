import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';

const TestWrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

TestWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

describe('Sidebar Component', () => {
	test('renders sidebar component', () => {
		render(
			<TestWrapper>
				<Sidebar />
			</TestWrapper>
		);

		expect(screen.getByText('Store Navigation')).toBeInTheDocument();
	});

	test('renders navigation links', () => {
		render(
			<TestWrapper>
				<Sidebar />
			</TestWrapper>
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Products')).toBeInTheDocument();
		expect(screen.getByText('Cart')).toBeInTheDocument();
		expect(screen.getByText('Checkout')).toBeInTheDocument();
		expect(screen.getByText('Login/Register')).toBeInTheDocument();
	});

	test('navigation links have correct href attributes', () => {
		render(
			<TestWrapper>
				<Sidebar />
			</TestWrapper>
		);

		expect(screen.getByText('Home').closest('a')).toHaveAttribute(
			'href',
			'/'
		);
		expect(screen.getByText('Products').closest('a')).toHaveAttribute(
			'href',
			'/products'
		);
		expect(screen.getByText('Cart').closest('a')).toHaveAttribute(
			'href',
			'/cart'
		);
		expect(screen.getByText('Checkout').closest('a')).toHaveAttribute(
			'href',
			'/checkout'
		);
		expect(screen.getByText('Login/Register').closest('a')).toHaveAttribute(
			'href',
			'/auth'
		);
	});
});
