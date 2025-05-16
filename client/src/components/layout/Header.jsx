import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
    const { getTotalItems } = useCart();
    
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">E-Commerce Store</Link>
            </div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/cart">Cart ({getTotalItems()})</Link></li>
                    <li><Link to="/auth">Login/Register</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;