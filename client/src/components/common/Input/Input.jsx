import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const Input = ({
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	required = false,
	error = false,
	helperText = '',
	fullWidth = true,
	variant = 'outlined',
	size = 'medium',
	disabled = false,
	startAdornment = null,
	endAdornment = null,
	multiline = false,
	rows = 1,
}) => {
	return (
		<TextField
			label={label}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			error={error}
			helperText={helperText}
			fullWidth={fullWidth}
			variant={variant}
			size={size}
			disabled={disabled}
			multiline={multiline}
			rows={rows}
			InputProps={{
				startAdornment: startAdornment ? (
					<InputAdornment position="start">{startAdornment}</InputAdornment>
				) : null,
				endAdornment: endAdornment ? (
					<InputAdornment position="end">{endAdornment}</InputAdornment>
				) : null,
			}}
		/>
	);
};

Input.propTypes = {
	label: PropTypes.string,
	type: PropTypes.string,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	error: PropTypes.bool,
	helperText: PropTypes.string,
	fullWidth: PropTypes.bool,
	variant: PropTypes.oneOf(['standard', 'filled', 'outlined']),
	size: PropTypes.oneOf(['small', 'medium']),
	disabled: PropTypes.bool,
	startAdornment: PropTypes.node,
	endAdornment: PropTypes.node,
	multiline: PropTypes.bool,
	rows: PropTypes.number,
};

export default Input;