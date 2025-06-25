import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageRenderer from './PageRenderer';

// Mock the ComponentRegistry
jest.mock('./ComponentRegistry', () => ({
	renderComponent: jest.fn(component => (
		<div data-testid={`rendered-component-${component.componentId}`}>
			{component.componentId}
		</div>
	)),
}));

describe.skip('PageRenderer Component', () => {
	test('renders empty state when no components', () => {
		render(<PageRenderer components={[]} />);

		expect(
			screen.getByText('This page has no components yet.')
		).toBeInTheDocument();
	});

	test('renders components when provided', () => {
		const components = [
			{ id: '1', componentId: 'text', props: { text: 'Hello' } },
			{ id: '2', componentId: 'heading', props: { text: 'World' } },
		];

		render(<PageRenderer components={components} />);

		expect(
			screen.getByTestId('rendered-component-text')
		).toBeInTheDocument();
		expect(
			screen.getByTestId('rendered-component-heading')
		).toBeInTheDocument();
	});

	test('renders with container by default', () => {
		const components = [
			{ id: '1', componentId: 'text', props: { text: 'Hello' } },
		];

		const { container } = render(<PageRenderer components={components} />);

		// Should have MUI Container component
		expect(
			container.querySelector('.MuiContainer-root')
		).toBeInTheDocument();
	});

	test('renders full width when containerProps.maxWidth is false', () => {
		const components = [
			{ id: '1', componentId: 'text', props: { text: 'Hello' } },
		];

		const { container } = render(
			<PageRenderer
				components={components}
				containerProps={{ maxWidth: false }}
			/>
		);

		// Should not have MUI Container component
		expect(
			container.querySelector('.MuiContainer-root')
		).not.toBeInTheDocument();
	});

	test('handles invalid components prop gracefully', () => {
		render(<PageRenderer components="invalid" />);

		expect(
			screen.getByText('Invalid page configuration')
		).toBeInTheDocument();
	});

	test('renders with custom container props', () => {
		const components = [
			{ id: '1', componentId: 'text', props: { text: 'Hello' } },
		];

		render(
			<PageRenderer
				components={components}
				containerProps={{ maxWidth: 'sm' }}
			/>
		);

		expect(
			screen.getByTestId('rendered-component-text')
		).toBeInTheDocument();
	});
});
