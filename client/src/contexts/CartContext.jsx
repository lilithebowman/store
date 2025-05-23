import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const CartContext = createContext();

export const useCart = () => {
	return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (item) => {
		setCartItems(prevItems => [...prevItems, item]);
	};

	const removeFromCart = (itemId) => {
		setCartItems(prevItems => prevItems.filter((item) => item.id !== itemId));
	};

	const getTotalItems = () => {
		return cartItems.length;
	};

	return (
		<CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalItems }}>
			{children}
		</CartContext.Provider>
	);
};

// Add PropTypes validation for CartProvider
CartProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
