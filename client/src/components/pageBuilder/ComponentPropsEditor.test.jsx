import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentPropsEditor from './ComponentPropsEditor';

// Mock the ComponentRegistry
jest.mock('./ComponentRegistry', () => ({
	getComponentById: jest.fn(id => ({
		id,
		name: `${id} Component`,
		props: {
			content: {
				type: 'string',
				default: '',
				label: 'Content',
			},
			level: {
				type: 'number',
				default: 1,
				label: 'Level',
				min: 1,
				max: 6,
			},
			color: {
				type: 'select',
				default: 'primary',
				label: 'Color',
				options: ['primary', 'secondary', 'error'],
			},
			enabled: {
				type: 'boolean',
				default: true,
				label: 'Enabled',
			},
		},
	})),
}));

describe('ComponentPropsEditor', () => {
	const mockOnClose = jest.fn();
	const mockOnSave = jest.fn();

	const defaultProps = {
		open: true,
		component: {
			componentId: 'text',
			props: {
				content: 'Test content',
				level: 2,
				color: 'secondary',
				enabled: false,
			},
		},
		onClose: mockOnClose,
		onSave: mockOnSave,
	};

	beforeEach(() => {
		mockOnClose.mockClear();
		mockOnSave.mockClear();
	});

	test('renders props editor dialog when open', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(
			screen.getByText(/edit component properties/i)
		).toBeInTheDocument();
	});

	test('does not render dialog when closed', () => {
		render(<ComponentPropsEditor {...defaultProps} open={false} />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('renders form editor tab by default', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		expect(screen.getByText(/form editor/i)).toBeInTheDocument();
		expect(screen.getByText(/json editor/i)).toBeInTheDocument();
	});

	test('renders all prop types in form editor', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		// String input
		expect(screen.getByDisplayValue('Test content')).toBeInTheDocument();

		// Number input
		expect(screen.getByDisplayValue('2')).toBeInTheDocument();

		// Select input
		expect(screen.getByDisplayValue('secondary')).toBeInTheDocument();

		// Boolean checkbox
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).not.toBeChecked();
	});

	test('updates string prop value', async () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		const contentInput = screen.getByDisplayValue('Test content');
		fireEvent.change(contentInput, {
			target: { value: 'Updated content' },
		});

		expect(contentInput.value).toBe('Updated content');
	});

	test('updates number prop value', async () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		const levelInput = screen.getByDisplayValue('2');
		fireEvent.change(levelInput, { target: { value: '3' } });

		expect(levelInput.value).toBe('3');
	});

	test('updates select prop value', async () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		const colorSelect = screen.getByDisplayValue('secondary');
		fireEvent.change(colorSelect, { target: { value: 'primary' } });

		expect(colorSelect.value).toBe('primary');
	});

	test('updates boolean prop value', async () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		const checkbox = screen.getByRole('checkbox');
		fireEvent.click(checkbox);

		expect(checkbox).toBeChecked();
	});

	test('switches to JSON editor tab', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		const jsonTab = screen.getByText(/json editor/i);
		fireEvent.click(jsonTab);

		// Should show JSON textarea
		expect(
			screen.getByRole('textbox', { name: /props json/i })
		).toBeInTheDocument();
	});

	test('shows JSON representation in JSON editor', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		// Switch to JSON tab
		const jsonTab = screen.getByText(/json editor/i);
		fireEvent.click(jsonTab);

		const jsonTextarea = screen.getByRole('textbox', {
			name: /props json/i,
		});
		const jsonValue = JSON.parse(jsonTextarea.value);

		expect(jsonValue).toEqual({
			content: 'Test content',
			level: 2,
			color: 'secondary',
			enabled: false,
		});
	});

	test('updates props from JSON editor', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		// Switch to JSON tab
		const jsonTab = screen.getByText(/json editor/i);
		fireEvent.click(jsonTab);

		const jsonTextarea = screen.getByRole('textbox', {
			name: /props json/i,
		});
		const newProps = {
			content: 'JSON updated content',
			level: 4,
			color: 'error',
			enabled: true,
		};

		fireEvent.change(jsonTextarea, {
			target: { value: JSON.stringify(newProps, null, 2) },
		});

		// Switch back to form tab to verify changes
		const formTab = screen.getByText(/form editor/i);
		fireEvent.click(formTab);

		expect(
			screen.getByDisplayValue('JSON updated content')
		).toBeInTheDocument();
		expect(screen.getByDisplayValue('4')).toBeInTheDocument();
		expect(screen.getByDisplayValue('error')).toBeInTheDocument();
		expect(screen.getByRole('checkbox')).toBeChecked();
	});

	test('shows JSON error for invalid JSON', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		// Switch to JSON tab
		const jsonTab = screen.getByText(/json editor/i);
		fireEvent.click(jsonTab);

		const jsonTextarea = screen.getByRole('textbox', {
			name: /props json/i,
		});
		fireEvent.change(jsonTextarea, { target: { value: 'invalid json' } });

		expect(screen.getByText(/invalid json/i)).toBeInTheDocument();
	});

	test('calls onSave with updated props when save is clicked', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		// Update a prop
		const contentInput = screen.getByDisplayValue('Test content');
		fireEvent.change(contentInput, {
			target: { value: 'Updated content' },
		});

		// Click save
		const saveButton = screen.getByText(/save/i);
		fireEvent.click(saveButton);

		expect(mockOnSave).toHaveBeenCalledWith(
			'text',
			expect.objectContaining({
				content: 'Updated content',
			})
		);
	});

	test('calls onClose when cancel is clicked', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		const cancelButton = screen.getByText(/cancel/i);
		fireEvent.click(cancelButton);

		expect(mockOnClose).toHaveBeenCalled();
	});

	test('calls onClose when dialog backdrop is clicked', () => {
		render(<ComponentPropsEditor {...defaultProps} />);

		// Click outside the dialog (on backdrop)
		const dialog = screen.getByRole('dialog');
		fireEvent.click(dialog.parentElement);

		expect(mockOnClose).toHaveBeenCalled();
	});

	test('renders nothing when component is null', () => {
		render(<ComponentPropsEditor {...defaultProps} component={null} />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('handles component with no props configuration', () => {
		const ComponentRegistry = require('./ComponentRegistry');
		ComponentRegistry.getComponentById.mockReturnValue({
			id: 'simple',
			name: 'Simple Component',
			props: {},
		});

		const propsWithSimpleComponent = {
			...defaultProps,
			component: { componentId: 'simple', props: {} },
		};

		render(<ComponentPropsEditor {...propsWithSimpleComponent} />);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(
			screen.getByText(/no configurable properties/i)
		).toBeInTheDocument();
	});
});
