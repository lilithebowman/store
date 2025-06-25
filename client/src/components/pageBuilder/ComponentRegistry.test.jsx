import React from 'react';
import '@testing-library/jest-dom';
import {
	COMPONENT_REGISTRY,
	getComponentById,
	getComponentsByCategory,
	renderComponent,
} from './ComponentRegistry';

// Mock the imported components
jest.mock('../common/Button/Button', () => {
	return function MockButton(props) {
		return <button {...props}>Mock Button</button>;
	};
});

jest.mock('../product/ProductCard/ProductCard', () => {
	return function MockProductCard(props) {
		return (
			<div data-testid="mock-product-card">{JSON.stringify(props)}</div>
		);
	};
});

jest.mock('../../stories/Header', () => ({
	Header: function MockHeader(props) {
		return (
			<header data-testid="mock-header">{JSON.stringify(props)}</header>
		);
	},
}));

describe('ComponentRegistry', () => {
	test('COMPONENT_REGISTRY contains expected components', () => {
		expect(COMPONENT_REGISTRY).toBeDefined();
		expect(typeof COMPONENT_REGISTRY).toBe('object');

		// Check for some expected components
		expect(COMPONENT_REGISTRY['button']).toBeDefined();
		expect(COMPONENT_REGISTRY['product-card']).toBeDefined();
	});

	test('getComponentById returns correct component', () => {
		const buttonComponent = getComponentById('button');

		expect(buttonComponent).toBeDefined();
		expect(buttonComponent.id).toBe('button');
		expect(buttonComponent.name).toBe('Button');
		expect(buttonComponent.category).toBeDefined();
	});

	test('getComponentById returns null for invalid id', () => {
		const invalidComponent = getComponentById('invalid-component');

		expect(invalidComponent).toBeUndefined();
	});

	test('getComponentsByCategory groups components correctly', () => {
		const componentsByCategory = getComponentsByCategory();

		expect(componentsByCategory).toBeDefined();
		expect(typeof componentsByCategory).toBe('object');

		// Should have at least some categories
		expect(Object.keys(componentsByCategory).length).toBeGreaterThan(0);
	});

	test('renderComponent renders a component correctly', () => {
		const component = {
			componentId: 'button',
			props: {
				label: 'Test Button',
				variant: 'contained',
			},
		};

		const rendered = renderComponent(component);

		expect(rendered).toBeDefined();
		expect(React.isValidElement(rendered)).toBe(true);
	});

	test('renderComponent handles invalid component id', () => {
		const component = {
			componentId: 'invalid-component',
			props: {},
		};

		const rendered = renderComponent(component);

		// Should return some fallback or error component
		expect(rendered).toBeDefined();
	});

	test('component definitions have required properties', () => {
		Object.values(COMPONENT_REGISTRY).forEach(component => {
			expect(component.id).toBeDefined();
			expect(component.name).toBeDefined();
			expect(component.category).toBeDefined();
			expect(component.component).toBeDefined();
		});
	});
});
