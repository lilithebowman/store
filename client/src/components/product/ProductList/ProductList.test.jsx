import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import { CartProvider } from '../../../contexts/CartContext';
import ProductList from './ProductList';

// Mock component wrapper with CartProvider
const TestWrapper = ({ children }) => {
	return <CartProvider>{children}</CartProvider>;
};

TestWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

describe('ProductList', () => {
	const mockProducts = [
		{
			id: 1,
			name: 'Product 1',
			price: '100.00',
			description: 'Test product 1',
			image: 'test-image-1.jpg',
		},
		{
			id: 2,
			name: 'Product 2',
			price: '200.00',
			description: 'Test product 2',
			image: 'test-image-2.jpg',
		},
	];

	test('renders ProductList component', () => {
		render(
			<TestWrapper>
				<ProductList products={mockProducts} />
			</TestWrapper>
		);

		// Check for product cards instead of list items
		mockProducts.forEach(product => {
			expect(screen.getByText(product.name)).toBeInTheDocument();
		});
	});

	test('displays product names', () => {
		render(
			<TestWrapper>
				<ProductList products={mockProducts} />
			</TestWrapper>
		);

		mockProducts.forEach(product => {
			expect(screen.getByText(product.name)).toBeInTheDocument();
		});
	});

	test('displays product prices', () => {
		render(
			<TestWrapper>
				<ProductList products={mockProducts} />
			</TestWrapper>
		);

		mockProducts.forEach(product => {
			// Price is displayed as $XXX.XX format
			expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
		});
	});

	test('displays empty state when no products', () => {
		render(
			<TestWrapper>
				<ProductList products={[]} />
			</TestWrapper>
		);

		expect(screen.getByText('No products available')).toBeInTheDocument();
	});

	test('renders Add to Cart buttons', () => {
		render(
			<TestWrapper>
				<ProductList products={mockProducts} />
			</TestWrapper>
		);

		const addToCartButtons = screen.getAllByText('Add to Cart');
		expect(addToCartButtons).toHaveLength(mockProducts.length);
	});
});
