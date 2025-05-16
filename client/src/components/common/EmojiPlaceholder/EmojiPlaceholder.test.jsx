// client/src/components/common/EmojiPlaceholder/EmojiPlaceholder.test.jsx
import React from 'react';
import { render } from '@testing-library/react';
import EmojiPlaceholder from './EmojiPlaceholder';

describe('EmojiPlaceholder Component', () => {
	it('renders a canvas element', () => {
		const { container } = render(<EmojiPlaceholder />);
		const canvasElement = container.querySelector('canvas');
		expect(canvasElement).toBeInTheDocument();
	});

	it('renders with default props', () => {
		const { container } = render(<EmojiPlaceholder />);
		const canvasElement = container.querySelector('canvas');
		expect(canvasElement).toHaveAttribute('width', '200');
		expect(canvasElement).toHaveAttribute('height', '200');
	});

	it('renders with custom props', () => {
		const { container } = render(<EmojiPlaceholder width={300} height={300} emojiCount={15} />);
		const canvasElement = container.querySelector('canvas');
		expect(canvasElement).toHaveAttribute('width', '300');
		expect(canvasElement).toHaveAttribute('height', '300');
	});
});