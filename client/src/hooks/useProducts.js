import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:2048/api`;

const useProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();

		const fetchProducts = async () => {
			try {
				const response = await axios.get(`${API_URL}/products`, {
					signal: abortController.signal
				});
				setProducts(response.data);
				setLoading(false);
			} catch (err) {
				if (axios.isCancel(err)) {
					return; // Component unmounted, ignore
				}
				console.error('Error fetching products:', err);
				setError('Failed to load products. Please try again later.');
				setLoading(false);
			}
		};

		fetchProducts();

		return () => {
			abortController.abort();
		};
	}, []);

	return {
		products,
		loading,
		error,
	};
};

export default useProducts;