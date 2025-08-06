import { useState } from 'react';

interface Indicio {
    expedienteId: string;
    descripcion: string;
    color: string;
    tamaño: string;
    peso: string;
    ubicacion: string;
    tecnico: string;
}

const IndicioForm = () => {
    const [ indicio, setIndicio ] = useState<Indicio>({
        expedienteId: '',
        descripcion: '',
        color: '',
        tamaño: '',
        peso: '',
        ubicacion: '',
        tecnico: 'Técnico DICRI'
    });

    // Simulación: expedientes disponibles (debería venir del backend)
    const expedientesDisponibles = [
        { id: 'EXP001', nombre: 'Expediente EXP001' },
        { id: 'EXP002', nombre: 'Expediente EXP002' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setIndicio({ ...indicio, [ name ]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Indicio registrado:', indicio);
        // Aquí deberías hacer un POST al backend
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Registrar Indicio</h2>

            <div className="mb-4">
                <label className="block font-medium text-gray-700">Expediente</label>
                <select
                    name="expedienteId"
                    value={indicio.expedienteId}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                >
                    <option value="">Seleccione un expediente</option>
                    {expedientesDisponibles.map(exp => (
                        <option key={exp.id} value={exp.id}>
                            {exp.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-medium text-gray-700">Descripción</label>
                <input
                    type="text"
                    name="descripcion"
                    value={indicio.descripcion}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-gray-700">Color</label>
                    <input
                        type="text"
                        name="color"
                        value={indicio.color}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Tamaño</label>
                    <input
                        type="text"
                        name="tamaño"
                        value={indicio.tamaño}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-gray-700">Peso</label>
                    <input
                        type="text"
                        name="peso"
                        value={indicio.peso}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>
                <div>
                    <label className="block font-medium text-gray-700">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={indicio.ubicacion}
                        onChange={handleChange}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block font-medium text-gray-700">Técnico que registra</label>
                <input
                    type="text"
                    name="tecnico"
                    value={indicio.tecnico}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 px-3 py-2 rounded-md"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition-all"
            >
                Guardar Indicio
            </button>
        </form>
    );
};

export default IndicioForm;
