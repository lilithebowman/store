// client/src/components/product/ProductCard/ProductCard.stories.jsx
import React from 'react';
import { CartProvider } from '../../../contexts/CartContext'; // Adjust the path as needed
import ProductCard from './ProductCard';
import EmojiPlaceholder from '../../common/EmojiPlaceholder/EmojiPlaceholder';

export default {
	title: 'Product/ProductCard',
	component: ProductCard,
	decorators: [
		(Story) => (
			<CartProvider>
				<Story />
			</CartProvider>
		),
	],
};

const Template = (args) => <ProductCard {...args} />;

export const Default = Template.bind({});
const emojiPlaceholder = new EmojiPlaceholder({
	width: 150,
	height: 150,
	emojiCount: 10,
});
Default.args = {
	product: {
		name: 'Sample Product',
		price: 19.99,
		image: emojiPlaceholder.toDataUrl(),
		description: 'This is a sample product description.',
	},
};

const emojiPlaceholder2 = new EmojiPlaceholder({
	width: 150,
	height: 150,
	emojiCount: 10,
});
export const OutOfStock = Template.bind({});
OutOfStock.args = {
	product: {
		name: 'Out of Stock Product',
		price: 29.99,
		image: emojiPlaceholder2.toDataUrl(),
		description: 'This product is currently out of stock.',
		isOutOfStock: true,
	},
};
