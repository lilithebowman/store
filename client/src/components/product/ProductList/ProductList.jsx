import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = ({ products }) => {
    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

ProductList.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string,
            description: PropTypes.string,
        })
    ).isRequired,
};

export default ProductList;