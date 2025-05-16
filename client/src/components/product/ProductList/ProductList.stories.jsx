import React from 'react';
import ProductList from './ProductList';

export default {
  title: 'Product/ProductList',
  component: ProductList,
};

const Template = (args) => <ProductList {...args} />;

export const Default = Template.bind({});
Default.args = {
  products: [
    {
      id: 1,
      name: 'Product 1',
      price: 29.99,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 39.99,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 49.99,
      image: 'https://via.placeholder.com/150',
    },
  ],
};