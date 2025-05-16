import React from 'react';
import Button from './Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default {
	title: 'Common/Button',
	component: Button,
	argTypes: {
		onClick: { action: 'clicked' },
		variant: {
			control: { type: 'select', options: ['text', 'contained', 'outlined'] },
		},
		color: {
			control: { type: 'select', options: ['primary', 'secondary', 'success', 'error', 'info', 'warning'] },
		},
		size: {
			control: { type: 'select', options: ['small', 'medium', 'large'] },
		},
	},
};

const Template = (args) => <Button {...args} />;

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
