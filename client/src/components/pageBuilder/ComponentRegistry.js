// Component registry for page builder
import React from 'react';

// Import all available components
import { Header as StorybookHeader } from '../../stories/Header';
import Button from '../common/Button/Button';
import ProductCard from '../product/ProductCard/ProductCard';

// Define available components with their configurations
export const COMPONENT_REGISTRY = {
	'storybook-header': {
		id: 'storybook-header',
		name: 'Header',
		category: 'Layout',
		component: StorybookHeader,
		icon: '📋',
		defaultProps: {
			user: null,
			onLogin: () => {},
			onLogout: () => {},
			onCreateAccount: () => {},
		},
		editableProps: {
			user: { type: 'object', label: 'User Data (JSON)' },
		},
	},
	button: {
		id: 'button',
		name: 'Button',
		category: 'Basic',
		component: Button,
		icon: '🔘',
		defaultProps: {
			label: 'Button',
			variant: 'contained',
			color: 'primary',
			size: 'medium',
			fullWidth: false,
			actionType: 'custom',
			linkUrl: '',
			productId: '',
			productName: 'Sample Product',
			productPrice: '99.99',
			productImage: 'https://via.placeholder.com/400x300',
			productDescription: 'Sample product description',
			showNotifications: true,
		},
		editableProps: {
			label: { type: 'text', label: 'Button Text' },
			variant: {
				type: 'select',
				label: 'Variant',
				options: ['text', 'contained', 'outlined'],
			},
			color: {
				type: 'select',
				label: 'Color',
				options: [
					'primary',
					'secondary',
					'success',
					'error',
					'info',
					'warning',
				],
			},
			size: {
				type: 'select',
				label: 'Size',
				options: ['small', 'medium', 'large'],
			},
			fullWidth: { type: 'boolean', label: 'Full Width' },
			actionType: {
				type: 'select',
				label: 'Action Type',
				options: ['custom', 'none', 'link', 'addToCart'],
			},
			linkUrl: { type: 'text', label: 'Link URL (for link action)' },
			productId: { type: 'text', label: 'Product ID (for cart action)' },
			productName: {
				type: 'text',
				label: 'Product Name (for cart action)',
			},
			productPrice: {
				type: 'text',
				label: 'Product Price (for cart action)',
			},
			productImage: {
				type: 'text',
				label: 'Product Image URL (for cart action)',
			},
			productDescription: {
				type: 'textarea',
				label: 'Product Description (for cart action)',
			},
		},
	},
	'product-card': {
		id: 'product-card',
		name: 'Product Card',
		category: 'E-commerce',
		component: ProductCard,
		icon: '🛍️',
		defaultProps: {
			product: {
				id: 1,
				name: 'Sample Product',
				description: 'This is a sample product description',
				price: '99.99',
				image: 'https://via.placeholder.com/400x300',
				stock: 10,
			},
		},
		editableProps: {
			'product.name': { type: 'text', label: 'Product Name' },
			'product.description': { type: 'textarea', label: 'Description' },
			'product.price': { type: 'text', label: 'Price' },
			'product.image': { type: 'text', label: 'Image URL' },
			'product.stock': { type: 'number', label: 'Stock' },
		},
	},
	'text-block': {
		id: 'text-block',
		name: 'Text Block',
		category: 'Content',
		component: ({ content }) =>
			React.createElement(
				'div',
				{
					style: { margin: '16px 0' },
				},
				React.createElement('div', {
					dangerouslySetInnerHTML: {
						__html: content || 'Add your text here...',
					},
				})
			),
		icon: '📝',
		defaultProps: {
			content: '<p>Add your text content here...</p>',
			variant: 'body1',
		},
		editableProps: {
			content: { type: 'richtext', label: 'Content' },
			variant: {
				type: 'select',
				label: 'Text Style',
				options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2'],
			},
		},
	},
	spacer: {
		id: 'spacer',
		name: 'Spacer',
		category: 'Layout',
		component: ({ height = 20 }) =>
			React.createElement('div', {
				style: { height: `${height}px`, width: '100%' },
			}),
		icon: '⏸️',
		defaultProps: {
			height: 20,
		},
		editableProps: {
			height: { type: 'number', label: 'Height (px)' },
		},
	},
};

export const getComponentsByCategory = () => {
	const categories = {};
	Object.values(COMPONENT_REGISTRY).forEach(component => {
		if (!categories[component.category]) {
			categories[component.category] = [];
		}
		categories[component.category].push(component);
	});
	return categories;
};

export const getComponentById = id => {
	return COMPONENT_REGISTRY[id];
};

export const renderComponent = componentData => {
	const { componentId, props, id } = componentData;
	const componentConfig = getComponentById(componentId);

	if (!componentConfig) {
		console.warn(
			`Component with id "${componentId}" not found in registry`
		);
		return React.createElement(
			'div',
			{
				key: id,
				style: {
					padding: '20px',
					border: '2px dashed #ccc',
					textAlign: 'center',
					color: '#666',
				},
			},
			`Component "${componentId}" not found`
		);
	}

	const Component = componentConfig.component;
	const mergedProps = { ...componentConfig.defaultProps, ...props };

	return React.createElement(Component, { key: id, ...mergedProps });
};
