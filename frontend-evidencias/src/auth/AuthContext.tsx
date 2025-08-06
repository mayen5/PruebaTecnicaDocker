import { createContext } from 'react';

export type Rol = 'tecnico' | 'coordinador';

export interface AuthContextType {
    isAuthenticated: boolean;
    rol: Rol;
    login: (rol: Rol) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
