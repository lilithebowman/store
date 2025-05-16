import React, { useState, useEffect } from 'react';
import ProductList from '../components/product/ProductList/ProductList';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
        <div className="home-container">
            <h1>Welcome to our Store</h1>
            {products.length === 0 ? (
                <p>No products available at the moment.</p>
            ) : (
                <ProductList products={products} />
            )}
        </div>
    );
};

export default Home;