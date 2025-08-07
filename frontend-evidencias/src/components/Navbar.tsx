import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const Navbar = () => {
    const [ isOpen, setIsOpen ] = useState(false);
    const { isAuthenticated, logout, rol } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">DICRI - Sistema de Evidencias</h1>

                {/* Botón hamburguesa */}
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menú en escritorio */}
                <ul className="hidden md:flex gap-4 text-sm items-center">
                    <li><Link to="/" className="px-3 py-2 rounded hover:bg-blue-700">Inicio</Link></li>

                    {isAuthenticated && rol !== 'coordinador' && (
                        <>
                            <li><Link to="/expediente" className="px-3 py-2 rounded hover:bg-blue-700">Registro de Expedientes</Link></li>
                            <li><Link to="/indicio" className="px-3 py-2 rounded hover:bg-blue-700">Registro de Indicios</Link></li>
                        </>
                    )}

                    {isAuthenticated && rol === 'coordinador' && (
                        <li><Link to="/revisar" className="px-3 py-2 rounded hover:bg-blue-700">Revisar Expedientes</Link></li>
                    )}

                    {isAuthenticated && (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white"
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    )}

                    {!isAuthenticated && (
                        <li>
                            <Link
                                to="/login"
                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
                            >
                                Iniciar sesión
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            {/* Menú móvil */}
            {isOpen && (
                <ul className="md:hidden px-4 pb-4 text-sm space-y-2 bg-blue-700">
                    <li><Link to="/" onClick={toggleMenu} className="block py-2">Inicio</Link></li>

                    {isAuthenticated && rol !== 'coordinador' && (
                        <>
                            <li><Link to="/expediente" onClick={toggleMenu} className="block py-2">Registro de Expedientes</Link></li>
                            <li><Link to="/indicio" onClick={toggleMenu} className="block py-2">Registro de Indicios</Link></li>
                        </>
                    )}

                    {isAuthenticated && rol === 'coordinador' && (
                        <li><Link to="/revisar" onClick={toggleMenu} className="block py-2">Revisar Expedientes</Link></li>
                    )}

                    {isAuthenticated && (
                        <li>
                            <button
                                onClick={() => {
                                    toggleMenu();
                                    handleLogout();
                                }}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                            >
                                Cerrar sesión
                            </button>
                        </li>
                    )}

                    {!isAuthenticated && (
                        <li>
                            <Link
                                to="/login"
                                onClick={toggleMenu}
                                className="block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-center"
                            >
                                Iniciar sesión
                            </Link>
                        </li>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
