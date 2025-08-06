import { useState } from 'react';
import { AuthContext, type Rol } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);
    const [ rol, setRol ] = useState<Rol>('tecnico'); // valor por defecto

    const login = (rol: Rol) => {
        setIsAuthenticated(true);
        setRol(rol);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRol('tecnico'); // resetear rol
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
