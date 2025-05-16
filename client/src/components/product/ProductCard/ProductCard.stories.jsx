import React from 'react';
import ProductCard from './ProductCard';

export default {
  title: 'Product/ProductCard',
  component: ProductCard,
};

const Template = (args) => <ProductCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  product: {
    name: 'Sample Product',
    price: 19.99,
    image: 'https://via.placeholder.com/150',
    description: 'This is a sample product description.',
  }
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  product: {
    name: 'Out of Stock Product',
    price: 29.99,
    image: 'https://via.placeholder.com/150',
    description: 'This product is currently out of stock.',
    isOutOfStock: true,
  }
};