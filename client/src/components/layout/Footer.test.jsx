import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

describe('Footer Component', () => {
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer Component', () => {
	test('renders footer component', () => {
		render(
			<BrowserRouter>
				<Footer />
			</BrowserRouter>
		);

		// Footer should be present in the document
		const footer = screen.getByRole('contentinfo');
		expect(footer).toBeInTheDocument();
	});
});

	test('displays copyright information', () => {
		render(<Footer />);

		// Should display current year and copyright
		const currentYear = new Date().getFullYear();
		expect(
			screen.getByText(new RegExp(currentYear.toString()))
		).toBeInTheDocument();
		expect(screen.getByText(/copyright|©/i)).toBeInTheDocument();
	});

	test('contains footer content and styling', () => {
		render(<Footer />);

		const footer = screen.getByRole('contentinfo');

		// Footer should have appropriate styling classes or content
		expect(footer).toBeInTheDocument();
	});
});
