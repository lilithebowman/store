import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductList from './ProductList';

describe('ProductList', () => {
	const mockProducts = [
		{ id: 1, name: 'Product 1', price: 100 },
		{ id: 2, name: 'Product 2', price: 200 },
	];

	test('renders ProductList component', () => {
		render(<ProductList products={mockProducts} />);
		const productElements = screen.getAllByRole('listitem');
		expect(productElements.length).toBe(mockProducts.length);
	});

	test('displays product names', () => {
		render(<ProductList products={mockProducts} />);
		mockProducts.forEach(product => {
			expect(screen.getByText(product.name)).toBeInTheDocument();
		});
	});

	test('displays product prices', () => {
		render(<ProductList products={mockProducts} />);
		mockProducts.forEach(product => {
			expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
		});
	});
});
