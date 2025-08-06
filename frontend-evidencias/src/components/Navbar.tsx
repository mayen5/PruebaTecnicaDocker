import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const Navbar = () => {
    const [ isOpen, setIsOpen ] = useState(false);
    const { isAuthenticated, login, logout, rol } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    const MenuLinks = () => (
        <>
            <li><Link to="/expediente" className="hover:underline">Registro de Expedientes</Link></li>
            <li><Link to="/indicio" className="hover:underline">Registro de Indicios</Link></li>
            {rol === 'coordinador' && (
                <li><Link to="/revisar" className="hover:underline">Revisar Expedientes</Link></li>
            )}
        </>
    );

    return (
        <nav className="bg-blue-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">DICRI - Sistema de Evidencias</h1>

                {/* Botón hamburguesa (móvil) */}
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
                <ul className="hidden md:flex gap-4 items-center text-sm">
                    <li><Link to="/" className="hover:underline">Inicio</Link></li>
                    {isAuthenticated && <MenuLinks />}
                    <li>
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs italic">Rol: <strong>{rol}</strong></span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => login('tecnico')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Iniciar como Técnico
                                </button>
                                <button
                                    onClick={() => login('coordinador')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Iniciar como Coordinador
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>

            {/* Menú móvil */}
            {isOpen && (
                <ul className="md:hidden px-4 pb-4 text-sm space-y-2 bg-blue-700">
                    <li><Link to="/" onClick={toggleMenu}>Inicio</Link></li>
                    {isAuthenticated && (
                        <>
                            <MenuLinks />
                            <li className="text-xs italic">Rol: <strong>{rol}</strong></li>
                            <li>
                                <button
                                    onClick={() => {
                                        logout();
                                        toggleMenu();
                                    }}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    )}
                    {!isAuthenticated && (
                        <li className="flex flex-col gap-2">
                            <button
                                onClick={() => {
                                    login('tecnico');
                                    toggleMenu();
                                }}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Iniciar como Técnico
                            </button>
                            <button
                                onClick={() => {
                                    login('coordinador');
                                    toggleMenu();
                                }}
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Iniciar como Coordinador
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
