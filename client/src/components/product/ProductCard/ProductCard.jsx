import React from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css'; // Assuming you have a CSS file for styling

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <span className="product-price">${product.price}</span>
            <button className="add-to-cart-button">Add to Cart</button>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

export default ProductCard;