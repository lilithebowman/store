import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Checkout = () => {
	// Use the useCart hook instead of using useContext with CartContext
	const { cartItems, getTotalPrice } = useCart();
	const { user } = useContext(AuthContext);
	const navigate = useNavigate(); // Use useNavigate instead of useHistory

	const handleCheckout = () => {
		if (!user) {
			navigate('/auth'); // Redirect to Auth page if not logged in
		} else {
			// Proceed with checkout logic
			console.log('Proceeding to checkout with items:', cartItems);
			// Add your checkout logic here (e.g., API call to create an order)
		}
	};

	return (
		<div className="checkout">
			<h1>Checkout</h1>
			{cartItems.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<div>
					<h2>Your Items:</h2>
					<ul>
						{cartItems.map((item, index) => (
							<li key={index}>{item.name} - ${item.price}</li>
						))}
					</ul>
					<h3>Total Amount: ${getTotalPrice()}</h3>
					<button onClick={handleCheckout}>Proceed to Checkout</button>
				</div>
			)}
		</div>
	);
};

export default Checkout;