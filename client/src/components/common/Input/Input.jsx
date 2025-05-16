import React from 'react';
import PropTypes from 'prop-types';
import './Input.css'; // Assuming you have some styles for the Input component

const Input = ({ label, type, value, onChange, placeholder, required }) => {
    return (
        <div className="input-container">
            {label && <label className="input-label">{label}</label>}
            <input
                className="input-field"
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
};

Input.defaultProps = {
    type: 'text',
    placeholder: '',
    required: false,
};

export default Input;