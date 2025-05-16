import React, { createContext, useState, useEffect } from 'react';
import { getUser, loginUser, logoutUser, registerUser } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getUser();
            setUser(currentUser);
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        const loggedInUser = await loginUser(credentials);
        setUser(loggedInUser);
    };

    const register = async (userData) => {
        const newUser = await registerUser(userData);
        setUser(newUser);
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};