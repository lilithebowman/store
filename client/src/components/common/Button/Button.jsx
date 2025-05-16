import React from 'react';
import PropTypes from 'prop-types';
import MuiButton from '@mui/material/Button';

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
	endIcon = null
}) => {
	return (
		<MuiButton
			type={type}
			onClick={onClick}
			disabled={disabled}
			variant={variant}
			color={color}
			size={size}
			fullWidth={fullWidth}
			startIcon={startIcon}
			endIcon={endIcon}
		>
			{label}
		</MuiButton>
	);
};

Button.propTypes = {
	label: PropTypes.string.isRequired,
	onClick: PropTypes.func,
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
	disabled: PropTypes.bool,
	variant: PropTypes.oneOf(['text', 'contained', 'outlined']),
	color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	fullWidth: PropTypes.bool,
	startIcon: PropTypes.node,
	endIcon: PropTypes.node
};

export default Button;