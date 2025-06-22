import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import PageRenderer from '../components/pageBuilder/PageRenderer';
import ProductList from '../components/product/ProductList/ProductList';
import useProducts from '../hooks/useProducts';

const Home = () => {
	const [page, setPage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const {
		products,
		loading: productsLoading,
		error: productsError,
	} = useProducts();

	useEffect(() => {
		const fetchHomePage = async () => {
			try {
				setLoading(true);
				const baseURL =
					process.env.REACT_APP_API_BASE_URL ||
					`http://${window.location.hostname}:2048/api`;

				const response = await fetch(`${baseURL}/pages/slug/home`);

				if (response.ok) {
					const data = await response.json();
					setPage(data);
				} else if (response.status === 404) {
					// Home page doesn't exist yet, show fallback content
					setError('fallback');
				} else {
					throw new Error('Failed to fetch home page');
				}
			} catch (error) {
				console.error('Error fetching home page:', error);
				setError('Failed to load home page');
			} finally {
				setLoading(false);
			}
		};

		fetchHomePage();
	}, []);

	// Show loading state
	if (loading) {
		return (
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '50vh',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	// Show error or fallback content
	if (error && error !== 'fallback') {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	// If we have page data, render it with full width
	if (page && page.components && page.components.length > 0) {
		return (
			<Box sx={{ width: '100%', minHeight: '50vh' }}>
				<PageRenderer
					components={page.components}
					containerProps={{
						maxWidth: false,
						disableGutters: true,
						sx: { width: '100%' },
					}}
				/>
			</Box>
		);
	}

	// Fallback content when no home page exists in database
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h3" component="h1" gutterBottom align="center">
				Welcome to Our Store
			</Typography>
			<Typography
				variant="h6"
				color="text.secondary"
				gutterBottom
				align="center"
				sx={{ mb: 4 }}
			>
				Discover amazing products and unbeatable deals
			</Typography>

			{productsLoading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{productsError && (
				<Alert severity="error" sx={{ my: 2 }}>
					{productsError}
				</Alert>
			)}

			{products && products.length > 0 && (
				<Box>
					<Typography
						variant="h4"
						component="h2"
						gutterBottom
						align="center"
						sx={{ mb: 3 }}
					>
						Featured Products
					</Typography>
					<ProductList products={products} />
				</Box>
			)}

			<Box
				sx={{
					mt: 4,
					p: 2,
					bgcolor: 'background.paper',
					borderRadius: 1,
				}}
			>
				<Alert severity="info">
					<Typography variant="body2">
						<strong>Admin Note:</strong> To customize this home
						page, go to the Page Management section and create a
						page with slug &quot;home&quot;, or edit an existing
						home page.
					</Typography>
				</Alert>
			</Box>
		</Box>
	);
};

export default Home;
