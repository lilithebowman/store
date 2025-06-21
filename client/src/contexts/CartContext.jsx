import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const CartContext = createContext();

export const useCart = () => {
	return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = item => {
		setCartItems(prevItems => {
			const existingItem = prevItems.find(
				cartItem => cartItem.id === item.id
			);
			if (existingItem) {
				return prevItems.map(cartItem =>
					cartItem.id === item.id
						? {
								...cartItem,
								quantity: (cartItem.quantity || 1) + 1,
							}
						: cartItem
				);
			}
			return [...prevItems, { ...item, quantity: 1 }];
		});
	};

	const removeFromCart = itemId => {
		setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
	};

	const updateQuantity = (itemId, newQuantity) => {
		if (newQuantity <= 0) {
			removeFromCart(itemId);
			return;
		}
		setCartItems(prevItems =>
			prevItems.map(item =>
				item.id === itemId ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	const getTotalItems = () => {
		return cartItems.reduce(
			(total, item) => total + (item.quantity || 1),
			0
		);
	};

	const getTotalPrice = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * (item.quantity || 1),
			0
		);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				removeFromCart,
				updateQuantity,
				getTotalItems,
				getTotalPrice,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

// Add PropTypes validation for CartProvider
CartProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
