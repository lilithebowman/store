import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/product/:id" component={Product} />
							<Route path="/cart" component={Cart} />
							<Route path="/checkout" component={Checkout} />
							<Route path="/auth" component={Auth} />
						</Switch>
						<Footer />
					</Router>
				</CartProvider>
			</AuthProvider>
		</ThemeProvider>
	);
};

export default App;