import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';
import type { Rol } from '../auth/AuthContext';
import type { ReactElement } from 'react';

const RoleRoute = ({
    children,
    allowedRoles,
}: {
    children: ReactElement;
    allowedRoles: Rol[];
}) => {
    const { isAuthenticated, rol } = useAuth();

    if (!isAuthenticated) return <Navigate to="/" />;
    if (!allowedRoles.includes(rol)) return <Navigate to="/" />;

    return children;
};

export default RoleRoute;
