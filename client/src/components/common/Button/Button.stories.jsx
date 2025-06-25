import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from './Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartProvider } from '../../../contexts/CartContext';

// Wrapper to provide Router and Cart context for stories
const StoryWrapper = ({ children }) => (
	<BrowserRouter>
		<CartProvider>{children}</CartProvider>
	</BrowserRouter>
);

StoryWrapper.propTypes = {
	children: PropTypes.node.isRequired,
};

export default {
	title: 'Common/Button',
	component: Button,
	decorators: [
		Story => (
			<StoryWrapper>
				<Story />
			</StoryWrapper>
		),
	],
	argTypes: {
		onClick: { action: 'clicked' },
		variant: {
			control: {
				type: 'select',
				options: ['text', 'contained', 'outlined'],
			},
		},
		color: {
			control: {
				type: 'select',
				options: [
					'primary',
					'secondary',
					'success',
					'error',
					'info',
					'warning',
				],
			},
		},
		size: {
			control: { type: 'select', options: ['small', 'medium', 'large'] },
		},
	},
};

const Template = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
	label: 'Primary Button',
	variant: 'contained',
	color: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
	label: 'Secondary Button',
	variant: 'contained',
	color: 'secondary',
};

export const Outlined = Template.bind({});
Outlined.args = {
	label: 'Outlined Button',
	variant: 'outlined',
	color: 'primary',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
	label: 'Add to Cart',
	variant: 'contained',
	color: 'primary',
	startIcon: <ShoppingCartIcon />,
};

// Action Button Examples
export const LinkAction = Template.bind({});
LinkAction.args = {
	label: 'Visit Google',
	variant: 'contained',
	color: 'primary',
	actionType: 'link',
	linkUrl: 'https://google.com',
	showNotifications: true,
};

export const InternalLinkAction = Template.bind({});
InternalLinkAction.args = {
	label: 'Go to Profile',
	variant: 'outlined',
	color: 'secondary',
	actionType: 'link',
	linkUrl: '/profile',
	showNotifications: true,
};

export const AddToCartAction = Template.bind({});
AddToCartAction.args = {
	label: 'Add to Cart',
	variant: 'contained',
	color: 'success',
	actionType: 'addToCart',
	productId: 'sample-123',
	productName: 'Premium Wireless Headphones',
	productPrice: '149.99',
	productImage: 'https://via.placeholder.com/400x300',
	productDescription:
		'High-quality wireless headphones with noise cancellation',
	startIcon: <ShoppingCartIcon />,
	showNotifications: true,
};

export const SimpleClickAction = Template.bind({});
SimpleClickAction.args = {
	label: 'Click Me',
	variant: 'contained',
	color: 'info',
	actionType: 'none',
	showNotifications: true,
};
