// client/src/components/product/ProductList/ProductList.stories.jsx
import React from 'react';
import { CartProvider } from '../../../contexts/CartContext'; // Adjust the path as needed
import ProductList from './ProductList';

export default {
	title: 'Product/ProductList',
	component: ProductList,
	decorators: [
		(Story) => (
			<CartProvider>
				<Story />
			</CartProvider>
		),
	],
};

const Template = (args) => <ProductList {...args} />;

const getEmojiPlaceholderDataUrl = ((width, height, emojiCount) => {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) return '';
	
	// Generate random emojis
	const emojis = [];
	for (let i = 0; i < emojiCount; i++) {
		const emoji = String.fromCodePoint(0x1F600 + Math.floor(Math.random() * 80)); // Random emoji from U+1F600 to U+1F64F
		emojis.push(emoji);
	}

	// Draw emojis on the canvas
	emojis.forEach((emoji) => {
		const x = Math.random() * (canvas.width - 30); // Random x position
		const y = Math.random() * (canvas.height - 30); // Random y position
		ctx.font = '30px Arial';
		ctx.fillText(emoji, x, y);
	});

	return canvas.toDataURL();
});

export const Default = Template.bind({});
Default.args = {
	products: [
		{ id: 1, name: 'Product 1', price: 100, image: getEmojiPlaceholderDataUrl(600, 600, 100) },
		{ id: 2, name: 'Product 2', price: 200, image: getEmojiPlaceholderDataUrl(600, 600, 100) },
	],
};
