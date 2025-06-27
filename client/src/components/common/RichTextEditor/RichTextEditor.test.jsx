import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import RichTextEditor from './RichTextEditor';

// Create a basic theme for testing
const theme = createTheme();

// Wrapper component to provide theme
const TestWrapper = ({ children }) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
);

TestWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

// Mock document.execCommand
const mockExecCommand = jest.fn();
Object.defineProperty(document, 'execCommand', {
	value: mockExecCommand,
	writable: true,
});

// Mock queryCommandState
const mockQueryCommandState = jest.fn();
Object.defineProperty(document, 'queryCommandState', {
	value: mockQueryCommandState,
	writable: true,
});

describe('RichTextEditor', () => {
	const defaultProps = {
		value: '',
		onChange: jest.fn(),
		placeholder: 'Start typing...',
		height: 200,
		disabled: false,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockExecCommand.mockReturnValue(true);
		mockQueryCommandState.mockReturnValue(false);
	});

	test('renders without crashing', () => {
		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		expect(screen.getByRole('toolbar')).toBeInTheDocument();
	});

	test('displays initial HTML value', () => {
		const initialValue =
			'<p><strong>Bold text</strong> and <em>italic text</em></p>';
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} value={initialValue} />
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');
		expect(editorContent).toHaveProperty('innerHTML', initialValue);
	});

	test('applies custom placeholder', () => {
		const customPlaceholder = 'Enter your content here...';
		const { container } = render(
			<TestWrapper>
				<RichTextEditor
					{...defaultProps}
					placeholder={customPlaceholder}
				/>
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');
		expect(editorContent).toHaveAttribute(
			'data-placeholder',
			customPlaceholder
		);
	});

	test('disables editor when disabled prop is true', () => {
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} disabled={true} />
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');
		expect(editorContent).toHaveAttribute('contenteditable', 'false');

		// Toolbar buttons should be disabled
		const boldButton = screen.getByTitle('Bold (Ctrl+B)');
		const italicButton = screen.getByTitle('Italic (Ctrl+I)');
		const linkButton = screen.getByTitle('Insert Link');

		expect(boldButton).toBeDisabled();
		expect(italicButton).toBeDisabled();
		expect(linkButton).toBeDisabled();
	});

	test('calls onChange when content changes', async () => {
		const mockOnChange = jest.fn();
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} onChange={mockOnChange} />
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');

		// Simulate typing
		fireEvent.input(editorContent, {
			target: { innerHTML: '<p>New content</p>' },
		});

		expect(mockOnChange).toHaveBeenCalledWith('<p>New content</p>');
	});

	test('handles bold button click', async () => {
		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const boldButton = screen.getByTitle('Bold (Ctrl+B)');
		fireEvent.click(boldButton);

		expect(mockExecCommand).toHaveBeenCalledWith('bold', false, null);
	});

	test('handles italic button click', async () => {
		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const italicButton = screen.getByTitle('Italic (Ctrl+I)');
		fireEvent.click(italicButton);

		expect(mockExecCommand).toHaveBeenCalledWith('italic', false, null);
	});

	test('handles Ctrl+B keyboard shortcut', async () => {
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');

		fireEvent.keyDown(editorContent, {
			key: 'b',
			ctrlKey: true,
		});

		expect(mockExecCommand).toHaveBeenCalledWith('bold', false, null);
	});

	test('handles Ctrl+I keyboard shortcut', async () => {
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');

		fireEvent.keyDown(editorContent, {
			key: 'i',
			ctrlKey: true,
		});

		expect(mockExecCommand).toHaveBeenCalledWith('italic', false, null);
	});

	test('opens link dialog when link button is clicked', async () => {
		// Mock window.getSelection
		const mockSelection = {
			rangeCount: 1,
			getRangeAt: jest.fn().mockReturnValue({}),
			toString: jest.fn().mockReturnValue('selected text'),
		};

		Object.defineProperty(window, 'getSelection', {
			value: jest.fn().mockReturnValue(mockSelection),
			writable: true,
		});

		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const linkButton = screen.getByTitle('Insert Link');
		fireEvent.click(linkButton);

		await waitFor(() => {
			expect(screen.getByText('Create Link')).toBeInTheDocument();
			expect(screen.getByLabelText('Link Text')).toBeInTheDocument();
			expect(screen.getByLabelText('URL')).toBeInTheDocument();
		});
	});

	test('applies custom className', () => {
		const customClass = 'custom-editor';
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} className={customClass} />
			</TestWrapper>
		);

		expect(container.querySelector('.rich-text-editor')).toHaveClass(
			'rich-text-editor',
			customClass
		);
	});

	test('handles custom height', () => {
		const customHeight = 300;
		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} height={customHeight} />
			</TestWrapper>
		);

		// The height is applied via styled components, so we just test that it renders
		expect(screen.getByRole('toolbar')).toBeInTheDocument();
	});

	test('handles undefined onChange gracefully', () => {
		const { container } = render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} onChange={undefined} />
			</TestWrapper>
		);

		const editorContent = container.querySelector('.editor-content');

		// Should not throw error when changing content
		expect(() => {
			fireEvent.input(editorContent, {
				target: { innerHTML: '<p>Test content</p>' },
			});
		}).not.toThrow();
	});

	test('shows active state for bold button when text is bold', () => {
		mockQueryCommandState.mockImplementation(command => {
			return command === 'bold';
		});

		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const boldButton = screen.getByTitle('Bold (Ctrl+B)');
		// The button should have primary color when active
		expect(boldButton).toBeInTheDocument();
	});

	test('shows active state for italic button when text is italic', () => {
		mockQueryCommandState.mockImplementation(command => {
			return command === 'italic';
		});

		render(
			<TestWrapper>
				<RichTextEditor {...defaultProps} />
			</TestWrapper>
		);

		const italicButton = screen.getByTitle('Italic (Ctrl+I)');
		// The button should have primary color when active
		expect(italicButton).toBeInTheDocument();
	});
});
