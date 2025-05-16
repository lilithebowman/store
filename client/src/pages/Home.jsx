import React, { useState, useEffect } from 'react';
import ProductList from '../components/product/ProductList/ProductList';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Simulate API call with dummy data
        setTimeout(() => {
            const dummyProducts = [
                { id: 1, name: 'Product 1', price: 19.99, image: 'https://via.placeholder.com/150', description: 'This is product 1' },
                { id: 2, name: 'Product 2', price: 29.99, image: 'https://via.placeholder.com/150', description: 'This is product 2' },
                { id: 3, name: 'Product 3', price: 39.99, image: 'https://via.placeholder.com/150', description: 'This is product 3' },
            ];
            setProducts(dummyProducts);
            setLoading(false);
        }, 500);
    }, []);
    
    if (loading) {
        return <div>Loading products...</div>;
    }
    
    return (
        <div className="home-container">
            <h1>Welcome to our Store</h1>
            <ProductList products={products} />
        </div>
    );
};

export default Home;