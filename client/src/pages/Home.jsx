import React from 'react';
import ProductList from '../components/product/ProductList/ProductList';
import useProducts from '../hooks/useProducts';
import { Card } from '@mui/material';

const Home = () => {
	const { products, loading, error } = useProducts();

	if (loading) {
		return <div>Loading products...</div>;
	}

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<>
			<h1>Welcome to our Store</h1>
			<Card sx={{ p: 3, mt: 3 }}>
				<h2>Available Products</h2>
				<ProductList products={products} />
			</Card>
		</>
	);
};

export default Home;