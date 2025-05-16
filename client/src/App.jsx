import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
    return (
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
    );
};

export default App;