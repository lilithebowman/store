import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const useCart = () => {
    const { cartItems, addToCart, removeFromCart, clearCart } = useContext(CartContext);

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
    };
};

export default useCart;