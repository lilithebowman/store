import React from 'react';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
    test('renders input with placeholder', () => {
        render(<Input placeholder="Enter text" />);
        const inputElement = screen.getByPlaceholderText(/enter text/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('renders input with correct type', () => {
        render(<Input type="password" />);
        const inputElement = screen.getByRole('textbox');
        expect(inputElement).toHaveAttribute('type', 'password');
    });

    test('calls onChange handler when input value changes', () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);
        const inputElement = screen.getByRole('textbox');
        inputElement.value = 'New value';
        inputElement.dispatchEvent(new Event('input'));
        expect(handleChange).toHaveBeenCalled();
    });
});