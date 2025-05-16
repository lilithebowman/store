import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
    it('renders the button with the correct text', () => {
        render(<Button>Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: /click me/i });
        expect(buttonElement).toBeInTheDocument();
    });

    it('renders the button with the correct class', () => {
        render(<Button className="test-class">Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: /click me/i });
        expect(buttonElement).toHaveClass('test-class');
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const buttonElement = screen.getByRole('button', { name: /click me/i });
        buttonElement.click();
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});