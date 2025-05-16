import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { loginUser, registerUser, logoutUser } from '../services/auth';

const useAuth = () => {
    const { setAuthData } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/api/auth/status');
                const data = await response.json();
                if (data.isAuthenticated) {
                    setAuthData(data.user);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, [setAuthData]);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const user = await loginUser(credentials);
            setAuthData(user);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const user = await registerUser(userData);
            setAuthData(user);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setAuthData(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        login,
        register,
        logout,
        loading,
        error,
    };
};

export default useAuth;