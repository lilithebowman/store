import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = ({ products = [] }) => {
	if (!products || products.length === 0) {
		return (
			<Box sx={{ p: 3, textAlign: 'center' }}>
				<Typography variant="h6" color="text.secondary">
					No products available
				</Typography>
			</Box>
		);
	}
	
	return (
		<Grid container spacing={3} sx={{ p: 2 }}>
			{products.map(product => (
				<Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
					<ProductCard product={product} />
				</Grid>
			))}
		</Grid>
	);
};

ProductList.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			name: PropTypes.string.isRequired,
			price: PropTypes.number.isRequired,
			image: PropTypes.string.isRequired,
			description: PropTypes.string,
		})
	),
};

export default ProductList;