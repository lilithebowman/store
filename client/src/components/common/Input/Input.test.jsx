import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
	test('renders input with placeholder', () => {
		const handleChange = jest.fn();
		render(
			<Input placeholder="Enter text" value="" onChange={handleChange} />
		);
		const inputElement = screen.getByPlaceholderText(/enter text/i);
		expect(inputElement).toBeInTheDocument();
	});

	test('renders input with correct type', () => {
		const handleChange = jest.fn();
		render(<Input type="password" value="" onChange={handleChange} />);
		const inputElement = screen.getByDisplayValue('');
		expect(inputElement).toHaveAttribute('type', 'password');
	});

	test('calls onChange handler when input value changes', async () => {
		const user = userEvent.setup();
		const handleChange = jest.fn();
		render(<Input value="" onChange={handleChange} />);
		const inputElement = screen.getByRole('textbox');

		await user.type(inputElement, 'test');
		expect(handleChange).toHaveBeenCalled();
	});

	test('renders with label', () => {
		const handleChange = jest.fn();
		render(<Input label="Test Label" value="" onChange={handleChange} />);
		expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
	});

	test('renders with error state', () => {
		const handleChange = jest.fn();
		render(
			<Input
				value=""
				onChange={handleChange}
				error
				helperText="Error message"
			/>
		);
		expect(screen.getByText('Error message')).toBeInTheDocument();
	});

	test('renders as disabled when disabled prop is true', () => {
		const handleChange = jest.fn();
		render(<Input value="" onChange={handleChange} disabled />);
		const inputElement = screen.getByRole('textbox');
		expect(inputElement).toBeDisabled();
	});
});
