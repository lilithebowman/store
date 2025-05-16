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

export const Default = Template.bind({});
Default.args = {
	products: [
		{ id: 1, name: 'Product 1', price: 100 },
		{ id: 2, name: 'Product 2', price: 200 },
	],
};
