import React from 'react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/product/ProductCard/ProductCard';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart } = useCart();

    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map(item => (
                        <ProductCard 
                            key={item.id} 
                            product={item} 
                            onRemove={handleRemove} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;