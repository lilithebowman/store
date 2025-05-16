import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        const loggedInUser = await authService.login(credentials);
        setUser(loggedInUser);
    };

    const register = async (userData) => {
        const newUser = await authService.register(userData);
        setUser(newUser);
    };

    const logout = async () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};