import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import RegistroExpediente from '../pages/RegistroExpediente';
import AgregarIndicio from '../pages/AgregarIndicio';
import RevisarExpedientes from '../pages/RevisarExpedientes';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import Login from '../pages/Login';
import useAuth from '../auth/useAuth';

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    isAuthenticated ? <Home /> : <Navigate to="/login" />
                }
            />

            <Route path="/login" element={<Login />} />

            <Route
                path="/expediente"
                element={
                    <PrivateRoute>
                        <RoleRoute allowedRoles={[ 'tecnico' ]}>
                            <RegistroExpediente />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/indicio"
                element={
                    <PrivateRoute>
                        <RoleRoute allowedRoles={[ 'tecnico' ]}>
                            <AgregarIndicio />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/revisar"
                element={
                    <PrivateRoute>
                        <RoleRoute allowedRoles={[ 'coordinador' ]}>
                            <RevisarExpedientes />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
