import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
	const mockProduct = {
		id: 1,
		name: 'Test Product',
		price: 29.99,
		image: 'test-image-url.jpg',
		description: 'This is a test product.',
	};

	test('renders product name', () => {
		render(<ProductCard product={mockProduct} />);
		const productName = screen.getByText(/Test Product/i);
		expect(productName).toBeInTheDocument();
	});

	test('renders product price', () => {
		render(<ProductCard product={mockProduct} />);
		const productPrice = screen.getByText(/\$29.99/i);
		expect(productPrice).toBeInTheDocument();
	});

	test('renders product description', () => {
		render(<ProductCard product={mockProduct} />);
		const productDescription = screen.getByText(/This is a test product./i);
		expect(productDescription).toBeInTheDocument();
	});

	test('renders product image', () => {
		render(<ProductCard product={mockProduct} />);
		const productImage = screen.getByAltText(/Test Product/i);
		expect(productImage).toHaveAttribute('src', mockProduct.image);
	});
});