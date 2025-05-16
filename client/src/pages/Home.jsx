import React, { useState, useEffect } from 'react';
import ProductList from '../components/product/ProductList/ProductList';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const StyledArticle = styled('article')(({ theme }) => ({
	fontFamily: theme.typography.fontFamily,
	lineHeight: 1.4,
	width: '100%',
	padding: 20,
	margin: '0 auto',
	maxWidth: 600,
	color: theme.palette.text.primary,
	fontSize: theme.typography.fontSize,

	'& > h1': {
		fontSize: theme.typography.h5.fontSize,
		fontWeight: theme.typography.fontWeightBold,
		letterSpacing: '-0.08em',
		margin: '16px 0',
		color: theme.palette.text.primary,
	},

	'& > h2': {
		fontSize: theme.typography.h6.fontSize,
		fontWeight: theme.typography.fontWeightMedium,
		letterSpacing: '-0.08em',
		margin: '1em 0',
		color: theme.palette.text.primary,
	},

	'& > p': {
		margin: '1em 0',
	},

	'& > code': {
		fontSize: 14,
		padding: '0.2em 0.5em',
		margin: 0,
		borderRadius: 5,
		backgroundColor: '#f0f0f0',
	},

	'& .tip': {
		padding: '1em',
		fontSize: theme.typography.body2.fontSize,
		borderRadius: 10,
		backgroundColor: theme.palette.success.light,

		'& > h3': {
			fontSize: theme.typography.body1.fontSize,
			fontWeight: theme.typography.fontWeightBold,
			margin: '0.5em 0',
			color: theme.palette.success.dark,
		},

		'& > p': {
			margin: 0,
		},
	},

	'& .tip-index': {
		borderRadius: '1em',
		display: 'inline-block',
		backgroundColor: theme.palette.success.main,
		color: theme.palette.success.contrastText,
		marginRight: '1em',
		width: '2em',
		height: '2em',
		fontSize: theme.typography.body1.fontSize,

		'& > span': {
			marginTop: '0.4em',
			display: 'block',
			textAlign: 'center',
		},
	},

	'@media (min-width:600px)': {
		maxWidth: '100%',
		width: '100%',
	},
}));


const Home = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(`${API_URL}/products`);
				setProducts(response.data);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching products:', err);
				setError('Failed to load products. Please try again later.');
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	if (loading) {
		return <div>Loading products...</div>;
	}

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	return (
		<StyledArticle>
			<h1>Welcome to our Store</h1>
			{products.length === 0 ? (
				<p>No products available at the moment.</p>
			) : (
				<ProductList products={products} />
			)}
		</StyledArticle>
	);
};

export default Home;