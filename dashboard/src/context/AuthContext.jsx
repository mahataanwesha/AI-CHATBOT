import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('health_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (pincode) => {
        // Mock login logic - in prod connect to API
        // const res = await axios.post('/api/login', { pincode, role: 'ADMIN' });
        // if (res.data.success) ...

        // For demo/prototype without full auth backend:
        const role = pincode === '000000' ? 'SUPER_ADMIN' : 'HEALTH_WORKER';
        const newUser = { pincode, role, name: 'Regional Officer' };

        setUser(newUser);
        localStorage.setItem('health_user', JSON.stringify(newUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('health_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
