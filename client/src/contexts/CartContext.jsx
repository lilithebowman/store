import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const CartContext = createContext();

export const useCart = () => {
	return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (item) => {
		setCartItems([...cartItems, item]);
	};

	const removeFromCart = (itemId) => {
		setCartItems(cartItems.filter((item) => item.id !== itemId));
	};

	return (
		<CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
			{children}
		</CartContext.Provider>
	);
};

// Add PropTypes validation for CartProvider
CartProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
