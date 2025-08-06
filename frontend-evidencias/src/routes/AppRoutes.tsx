import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RegistroExpediente from '../pages/RegistroExpediente';
import AgregarIndicio from '../pages/AgregarIndicio';
import RevisarExpedientes from '../pages/RevisarExpedientes';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

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
