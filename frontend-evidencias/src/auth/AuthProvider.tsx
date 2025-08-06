import { useState } from 'react';
import AuthContext from './AuthContext';
import type { Rol } from './AuthContext';

interface Props {
    children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
    const [ token, setToken ] = useState<string | null>(localStorage.getItem('token'));
    const [ rol, setRol ] = useState<Rol | null>(localStorage.getItem('rol') as Rol | null);
    const [ username, setUsername ] = useState<string | null>(localStorage.getItem('username'));

    const isAuthenticated = !!token;

    const login = async (username: string, password: string): Promise<void> => {
        const response = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión');
        }

        const data = await response.json();

        setToken(data.token);
        setRol(data.user.rol);
        setUsername(data.user.username);

        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.user.rol);
        localStorage.setItem('username', data.user.username);
    };

    const logout = (): void => {
        setToken(null);
        setRol(null);
        setUsername(null);

        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                rol,
                username,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
