import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageRenderer from './PageRenderer';

// Mock the ComponentRegistry with a simpler approach
jest.mock('./ComponentRegistry', () => ({
	renderComponent: jest.fn(),
}));

// Import the mocked function after mocking
import { renderComponent } from './ComponentRegistry';
const mockRenderComponent = renderComponent;

describe('PageRenderer Component', () => {
	beforeEach(() => {
		mockRenderComponent.mockImplementation(componentData => {
			const { componentId, props, id } = componentData;

			if (componentId === 'text-block') {
				const textContent =
					props.content?.replace(/<[^>]*>/g, '') || 'Default text';
				return React.createElement(
					'div',
					{
						key: id,
						'data-testid': `rendered-component-${componentId}`,
					},
					textContent
				);
			}

			if (componentId === 'button') {
				return React.createElement(
					'button',
					{
						key: id,
						'data-testid': `rendered-component-${componentId}`,
					},
					props.label || 'Button'
				);
			}

			return React.createElement(
				'div',
				{
					key: id,
					'data-testid': `rendered-component-${componentId}`,
				},
				`${componentId} component`
			);
		});
	});

	test('renders empty state when no components', () => {
		render(<PageRenderer components={[]} />);

		expect(
			screen.getByText('This page has no components yet.')
		).toBeInTheDocument();
	});

	test('renders components when provided', () => {
		const components = [
			{
				id: '1',
				componentId: 'text-block',
				props: { content: '<p>Hello</p>' },
			},
			{ id: '2', componentId: 'button', props: { label: 'World' } },
		];

		render(<PageRenderer components={components} />);

		expect(screen.getByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('World')).toBeInTheDocument();
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
			{
				id: '1',
				componentId: 'text-block',
				props: { content: '<p>Hello</p>' },
			},
		];

		render(
			<PageRenderer
				components={components}
				containerProps={{ maxWidth: 'sm' }}
			/>
		);

		expect(screen.getByText('Hello')).toBeInTheDocument();
	});
});
