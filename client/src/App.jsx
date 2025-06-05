import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Auth, Cart, Checkout, Home, Product } from './pages/index';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import theme from './theme';

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<CartProvider>
					<Router>
						<Header />
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/product/:id" element={<Product />} />
							<Route path="/cart" element={<Cart />} />
							<Route path="/checkout" element={<Checkout />} />
							<Route path="/auth" element={<Auth />} />
						</Routes>
						<Footer />
					</Router>
				</CartProvider>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;