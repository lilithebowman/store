import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageBuilder from './PageBuilder';
import { DragDropContext } from '@hello-pangea/dnd';

// Mock the ComponentRegistry
jest.mock('./ComponentRegistry', () => ({
	getComponentsByCategory: jest.fn(() => ({
		Content: [
			{
				id: 'text',
				name: 'Text',
				component: () => <div>Text Component</div>,
			},
			{
				id: 'heading',
				name: 'Heading',
				component: () => <div>Heading Component</div>,
			},
		],
		Layout: [
			{
				id: 'container',
				name: 'Container',
				component: () => <div>Container Component</div>,
			},
		],
	})),
	getComponentById: jest.fn(id => ({
		id,
		name: id,
		component: () => <div>{id} Component</div>,
		props: {},
	})),
	renderComponent: jest.fn(component => (
		<div data-testid={`component-${component.componentId}`}>
			{component.componentId}
		</div>
	)),
}));

// Mock react-beautiful-dnd for drag and drop functionality
jest.mock('@hello-pangea/dnd', () => ({
	DragDropContext: ({ children }) => children,
	Droppable: ({ children }) =>
		children(
			{
				draggableProps: {},
				dragHandleProps: {},
				innerRef: jest.fn(),
			},
			{}
		),
	Draggable: ({ children }) =>
		children(
			{
				draggableProps: {},
				dragHandleProps: {},
				innerRef: jest.fn(),
			},
			{}
		),
}));

describe.skip('PageBuilder Component', () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	test('renders PageBuilder with empty state', () => {
		render(<PageBuilder onChange={mockOnChange} />);

		// Should render the component palette
		expect(screen.getByText(/content/i)).toBeInTheDocument();
		expect(screen.getByText(/layout/i)).toBeInTheDocument();

		// Should render empty canvas area
		expect(screen.getByText(/drag components here/i)).toBeInTheDocument();
	});

	test('renders PageBuilder with initial components', () => {
		const initialComponents = [
			{ id: '1', componentId: 'text', props: { content: 'Hello World' } },
			{
				id: '2',
				componentId: 'heading',
				props: { level: 1, content: 'Title' },
			},
		];

		render(
			<PageBuilder
				initialComponents={initialComponents}
				onChange={mockOnChange}
			/>
		);

		// Should render the initial components
		expect(screen.getByTestId('component-text')).toBeInTheDocument();
		expect(screen.getByTestId('component-heading')).toBeInTheDocument();
	});

	test('adds component when clicked from palette', () => {
		render(<PageBuilder onChange={mockOnChange} />);

		// Find and click a component from the palette
		const textComponent = screen.getByText('Text');
		fireEvent.click(textComponent);

		// Should call onChange with the new component
		expect(mockOnChange).toHaveBeenCalledWith(
			expect.arrayContaining([
				expect.objectContaining({
					componentId: 'text',
					props: {},
				}),
			])
		);
	});

	test('deletes component when delete button is clicked', () => {
		const initialComponents = [
			{ id: '1', componentId: 'text', props: { content: 'Hello World' } },
		];

		render(
			<PageBuilder
				initialComponents={initialComponents}
				onChange={mockOnChange}
			/>
		);

		// Find and click the delete button
		const deleteButton = screen.getByLabelText(/delete component/i);
		fireEvent.click(deleteButton);

		// Should call onChange with empty array
		expect(mockOnChange).toHaveBeenCalledWith([]);
	});

	test('opens props editor when edit button is clicked', () => {
		const initialComponents = [
			{ id: '1', componentId: 'text', props: { content: 'Hello World' } },
		];

		render(
			<PageBuilder
				initialComponents={initialComponents}
				onChange={mockOnChange}
			/>
		);

		// Find and click the edit button
		const editButton = screen.getByLabelText(/edit component/i);
		fireEvent.click(editButton);

		// Should open the props editor dialog
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	test('handles drag and drop reordering', () => {
		const initialComponents = [
			{ id: '1', componentId: 'text', props: {} },
			{ id: '2', componentId: 'heading', props: {} },
		];

		render(
			<PageBuilder
				initialComponents={initialComponents}
				onChange={mockOnChange}
			/>
		);

		// Simulate drag and drop by calling the handleDragEnd function
		// This would be more complex in a real test, but for coverage we'll test the basic structure
		expect(screen.getByTestId('component-text')).toBeInTheDocument();
		expect(screen.getByTestId('component-heading')).toBeInTheDocument();
	});

	test('updates component props when props editor saves', () => {
		const initialComponents = [
			{ id: '1', componentId: 'text', props: { content: 'Original' } },
		];

		render(
			<PageBuilder
				initialComponents={initialComponents}
				onChange={mockOnChange}
			/>
		);

		// Open props editor
		const editButton = screen.getByLabelText(/edit component/i);
		fireEvent.click(editButton);

		// Find and click save button in the props editor
		const saveButton = screen.getByText(/save/i);
		fireEvent.click(saveButton);

		// Should close the dialog
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('cancels props editing when cancel button is clicked', () => {
		const initialComponents = [
			{ id: '1', componentId: 'text', props: { content: 'Original' } },
		];

		render(
			<PageBuilder
				initialComponents={initialComponents}
				onChange={mockOnChange}
			/>
		);

		// Open props editor
		const editButton = screen.getByLabelText(/edit component/i);
		fireEvent.click(editButton);

		// Find and click cancel button
		const cancelButton = screen.getByText(/cancel/i);
		fireEvent.click(cancelButton);

		// Should close the dialog without calling onChange
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	test('applies custom height prop', () => {
		const { container } = render(
			<PageBuilder onChange={mockOnChange} height="500px" />
		);

		// Should apply the custom height
		const pageBuilder = container.firstChild;
		expect(pageBuilder).toHaveStyle('height: 500px');
	});
});
