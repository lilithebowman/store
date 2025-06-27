import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MuiButton from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';

// Helper hook to safely use navigate when not in Router context
const useSafeNavigate = () => {
	try {
		return useNavigate();
	} catch {
		// Return a mock navigate function when not in Router context (e.g., Storybook)
		return path => {
			console.log('Navigate called with:', path);
			alert(`Would navigate to: ${path}`);
		};
	}
};

// Helper hook to safely use cart when not in Cart context
const useSafeCart = () => {
	try {
		return useCart();
	} catch {
		// Return a mock cart when not in Cart context
		return {
			addToCart: product => {
				console.log('Add to cart called with:', product);
				alert(`Would add to cart: ${product.name}`);
			},
		};
	}
};

const Button = ({
	label,
	onClick,
	type = 'button',
	disabled = false,
	variant = 'contained',
	color = 'primary',
	size = 'medium',
	fullWidth = false,
	startIcon = null,
	endIcon = null,
	// Action-specific props
	actionType = 'custom',
	linkUrl = '',
	productId = '',
	productName = 'Sample Product',
	productPrice = '99.99',
	productImage = 'https://via.placeholder.com/400x300',
	productDescription = 'Sample product description',
	showNotifications = false,
	...otherProps
}) => {
	const navigate = useSafeNavigate();
	const cartContext = useSafeCart();
	const [notification, setNotification] = useState({
		open: false,
		message: '',
		severity: 'success',
	});

	const handleActionClick = event => {
		event.preventDefault();

		switch (actionType) {
		case 'link':
			if (linkUrl) {
				if (
					linkUrl.startsWith('http') ||
						linkUrl.startsWith('https')
				) {
					// External link
					window.open(linkUrl, '_blank', 'noopener,noreferrer');
				} else {
					// Internal link
					navigate(linkUrl);
				}
			} else if (showNotifications) {
				setNotification({
					open: true,
					message: 'No URL specified for link action',
					severity: 'warning',
				});
			}
			break;

		case 'addToCart':
			if (cartContext && cartContext.addToCart && productId) {
				const product = {
					id: productId,
					name: productName,
					price: parseFloat(productPrice) || 0,
					image: productImage,
					description: productDescription,
				};
				cartContext.addToCart(product);

				if (showNotifications) {
					setNotification({
						open: true,
						message: `Added "${productName}" to cart!`,
						severity: 'success',
					});
				}
			} else if (showNotifications) {
				setNotification({
					open: true,
					message:
							'Unable to add to cart. Please check product settings.',
					severity: 'error',
				});
			}
			break;

		case 'none':
			if (showNotifications) {
				setNotification({
					open: true,
					message: `Button "${label}" clicked!`,
					severity: 'info',
				});
			}
			break;

		case 'custom':
		default:
			// Use the provided onClick handler for custom behavior
			if (onClick) {
				onClick(event);
			}
			break;
		}
	};

	const handleCloseNotification = () => {
		setNotification({ ...notification, open: false });
	};

	return (
		<>
			<MuiButton
				type={type}
				onClick={handleActionClick}
				disabled={disabled}
				variant={variant}
				color={color}
				size={size}
				fullWidth={fullWidth}
				startIcon={startIcon}
				endIcon={endIcon}
				{...otherProps}
			>
				{label}
			</MuiButton>

			{showNotifications && (
				<Snackbar
					open={notification.open}
					autoHideDuration={3000}
					onClose={handleCloseNotification}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				>
					<Alert
						onClose={handleCloseNotification}
						severity={notification.severity}
						sx={{ width: '100%' }}
					>
						{notification.message}
					</Alert>
				</Snackbar>
			)}
		</>
	);
};

Button.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	disabled: PropTypes.bool,
	variant: PropTypes.oneOf(['text', 'contained', 'outlined']),
	color: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'error',
		'info',
		'warning',
	]),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	fullWidth: PropTypes.bool,
	startIcon: PropTypes.node,
	endIcon: PropTypes.node,
	// Action-specific props
	actionType: PropTypes.oneOf(['custom', 'none', 'link', 'addToCart']),
	linkUrl: PropTypes.string,
	productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	productName: PropTypes.string,
	productPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	productImage: PropTypes.string,
	productDescription: PropTypes.string,
	showNotifications: PropTypes.bool,
};

export default Button;
