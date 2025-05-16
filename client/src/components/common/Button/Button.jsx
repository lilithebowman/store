import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // Assuming you have some styles for the button

const Button = ({ label, onClick, type = 'button', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="btn"
        >
            {label}
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
};

export default Button;