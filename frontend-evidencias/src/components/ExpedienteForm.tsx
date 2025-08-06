import { useState } from 'react';

const ExpedienteForm = () => {
    const [ expediente, setExpediente ] = useState({
        numero: '',
        fecha: new Date().toISOString().substring(0, 10),
        tecnico: 'Técnico DICRI'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setExpediente({ ...expediente, [ name ]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Expediente registrado:', expediente);
        // Aquí iría una petición POST al backend
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Registrar Expediente</h2>

            <div className="mb-4">
                <label className="block font-medium text-gray-700">Número de expediente</label>
                <input
                    type="text"
                    name="numero"
                    value={expediente.numero}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            <div className="mb-4">
                <label className="block font-medium text-gray-700">Fecha de registro</label>
                <input
                    type="date"
                    name="fecha"
                    value={expediente.fecha}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
            </div>

            <div className="mb-6">
                <label className="block font-medium text-gray-700">Técnico que registra</label>
                <input
                    type="text"
                    name="tecnico"
                    value={expediente.tecnico}
                    onChange={handleChange}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 rounded-md"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition-all"
            >
                Guardar Expediente
            </button>
        </form>
    );
};

export default ExpedienteForm;
