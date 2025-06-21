// client/src/components/product/ProductCard/ProductCard.stories.jsx
import React from 'react';
import { CartProvider } from '../../../contexts/CartContext'; // Adjust the path as needed
import ProductCard from './ProductCard';

export default {
	title: 'Product/ProductCard',
	component: ProductCard,
	decorators: [
		Story => (
			<CartProvider>
				<Story />
			</CartProvider>
		),
	],
};

const Template = args => <ProductCard {...args} />;

const getEmojiPlaceholderDataUrl = (width, height, emojiCount) => {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) return '';

	// Generate random emojis
	const emojis = [];
	for (let i = 0; i < emojiCount; i++) {
		const emoji = String.fromCodePoint(
			0x1f600 + Math.floor(Math.random() * 80)
		); // Random emoji from U+1F600 to U+1F64F
		emojis.push(emoji);
	}

	// Draw emojis on the canvas
	emojis.forEach(emoji => {
		const x = Math.random() * (canvas.width - 30); // Random x position
		const y = Math.random() * (canvas.height - 30); // Random y position
		ctx.font = '30px Arial';
		ctx.fillText(emoji, x, y);
	});

	return canvas.toDataURL();
};

export const Default = Template.bind({});
Default.args = {
	product: {
		name: 'Sample Product',
		price: 19.99,
		image: getEmojiPlaceholderDataUrl(600, 600, 100),
		description: 'This is a sample product description.',
	},
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
	product: {
		name: 'Out of Stock Product',
		price: 29.99,
		image: getEmojiPlaceholderDataUrl(600, 600, 100),
		description: 'This product is currently out of stock.',
		isOutOfStock: true,
	},
};

export const WithoutCartProvider = () => (
	<ProductCard
		product={{
			name: 'Test Product Without Cart',
			price: '39.99',
			image: getEmojiPlaceholderDataUrl(600, 600, 50),
			description: 'This tests ProductCard without CartProvider.',
		}}
	/>
);

export const WithLongProductName = Template.bind({});
WithLongProductName.args = {
	product: {
		name: 'This is a Very Long Product Name That Should Test How The Card Handles Text Overflow',
		price: '149.99',
		image: getEmojiPlaceholderDataUrl(600, 600, 75),
		description:
			'This product has a very long name to test the card layout and text wrapping capabilities. It should demonstrate how the component handles extensive text content.',
	},
};

export const ProductGrid = () => {
	const sampleProducts = [
		{
			name: 'Premium Headphones',
			price: '199.99',
			image: getEmojiPlaceholderDataUrl(400, 300, 20),
			description:
				'High-quality wireless headphones with noise cancellation',
		},
		{
			name: 'Smart Watch',
			price: '299.99',
			image: getEmojiPlaceholderDataUrl(400, 300, 25),
			description: 'Feature-rich smartwatch with health tracking',
		},
		{
			name: 'Laptop Stand',
			price: '49.99',
			image: getEmojiPlaceholderDataUrl(400, 300, 15),
			description: 'Ergonomic aluminum laptop stand for better posture',
		},
	];

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				gap: '16px',
				padding: '16px',
			}}
		>
			{sampleProducts.map((product, index) => (
				<ProductCard key={index} product={product} />
			))}
		</div>
	);
};

export const NoImage = Template.bind({});
NoImage.args = {
	product: {
		name: 'Product Without Image',
		price: '59.99',
		description:
			'This product demonstrates the fallback canvas when no image is provided.',
	},
};

export const ExpensiveProduct = Template.bind({});
ExpensiveProduct.args = {
	product: {
		name: 'Luxury Item',
		price: '2999.99',
		image: getEmojiPlaceholderDataUrl(600, 600, 5),
		description:
			'A premium luxury product with exceptional quality and craftsmanship.',
	},
};
