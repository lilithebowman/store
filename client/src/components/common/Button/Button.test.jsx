import React from 'react';

import { render, screen } from '@testing-library/react';
import Button from './Button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
	it('renders with default props', () => {
		render(<Button label="Click Me" />);
		const buttonElement = screen.getByRole('button', { name: /click me/i });
		expect(buttonElement).toBeInTheDocument();
		expect(buttonElement).toHaveClass('MuiButton-contained');
	});

	it('renders with custom variant', () => {
		render(<Button label="Outlined Button" variant="outlined" />);
		const buttonElement = screen.getByRole('button', { name: /outlined button/i });
		expect(buttonElement).toHaveClass('MuiButton-outlined');
	});

	it('renders with custom color', () => {
		render(<Button label="Primary Button" color="primary" />);
		const buttonElement = screen.getByRole('button', { name: /primary button/i });
		expect(buttonElement).toHaveClass('MuiButton-containedPrimary');
	});

	it('renders with icon', () => {
		render(<Button label="Add to Cart" startIcon={<span>🛒</span>} />);
		const buttonElement = screen.getByRole('button', { name: /add to cart/i });
		expect(buttonElement).toContainHTML('<span>🛒</span>');
	});
});
