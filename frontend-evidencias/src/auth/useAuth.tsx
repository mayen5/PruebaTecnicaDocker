import { useContext } from 'react';
import { AuthContext } from './AuthContext';

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe estar dentro de AuthProvider');
    return context;
};

export default useAuth;
