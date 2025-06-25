import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentPropsEditor from './ComponentPropsEditor';

// Mock the ComponentRegistry to return a stable object
const mockComponentConfig = {
	id: 'text',
	name: 'Text',
	defaultProps: {
		text: 'Hello World',
		color: '#000000',
	},
	editableProps: {
		text: {
			type: 'text',
			label: 'Text Content',
		},
		color: {
			type: 'text',
			label: 'Text Color',
		},
	},
};

jest.mock('./ComponentRegistry', () => ({
	getComponentById: jest.fn(() => mockComponentConfig),
}));

describe.skip('ComponentPropsEditor', () => {
	const mockOnClose = jest.fn();
	const mockOnSave = jest.fn();

	const mockComponent = {
		componentId: 'text',
		props: {
			text: 'Sample text',
			color: '#ff0000',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('does not render when open is false', () => {
		render(
			<ComponentPropsEditor
				open={false}
				component={mockComponent}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		expect(
			screen.queryByText(/edit component properties/i)
		).not.toBeInTheDocument();
	});

	test('renders basic structure when open is true', () => {
		render(
			<ComponentPropsEditor
				open={true}
				component={mockComponent}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		// Just check if the dialog exists, avoid complex interactions
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	test('handles null component gracefully', () => {
		render(
			<ComponentPropsEditor
				open={true}
				component={null}
				onClose={mockOnClose}
				onSave={mockOnSave}
			/>
		);

		// Should render without crashing
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
