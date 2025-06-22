import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import { CartProvider } from '../../../contexts/CartContext';
import ProductCard from './ProductCard';

// Mock component wrapper with CartProvider
const TestWrapper = ({ children }) => {
	return <CartProvider>{children}</CartProvider>;
};

TestWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

describe('ProductCard', () => {
	const mockProduct = {
		id: 1,
		name: 'Test Product',
		price: 29.99,
		image: 'test-image-url.jpg',
		description: 'This is a test product.',
	};

	test('renders product name', () => {
		render(
			<TestWrapper>
				<ProductCard product={mockProduct} />
			</TestWrapper>
		);
		const productName = screen.getAllByText(/Test Product/i)[0]; // Get the first occurrence (heading)
		expect(productName).toBeTruthy();
	});

	test('renders product price', () => {
		render(
			<TestWrapper>
				<ProductCard product={mockProduct} />
			</TestWrapper>
		);
		const productPrice = screen.getByText(/\$29\.99/i);
		expect(productPrice).toBeTruthy();
	});

	test('renders product description', () => {
		render(
			<TestWrapper>
				<ProductCard product={mockProduct} />
			</TestWrapper>
		);
		const productDescription = screen.getByText(/This is a test product./i);
		expect(productDescription).toBeTruthy();
	});

	test('renders product image', () => {
		render(
			<TestWrapper>
				<ProductCard product={mockProduct} />
			</TestWrapper>
		);
		const productImage = screen.getByAltText(/Test Product/i);
		expect(productImage.getAttribute('src')).toBe(mockProduct.image);
	});
});
