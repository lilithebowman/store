import React from 'react';
import './Footer.css';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="footer-content">
				<p>&copy; {new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
				<div className="footer-links">
					<a href="/privacy-policy">Privacy Policy</a>
					<a href="/terms-of-service">Terms of Service</a>
					<a href="/contact">Contact Us</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;