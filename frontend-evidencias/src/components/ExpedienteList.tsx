import { useEffect, useState } from 'react';

type Indicio = {
    id: number;
    descripcion: string | null;
    color: string | null;
    tamano: string | null;
    peso: number | null;
    ubicacion: string | null;
};

type Expediente = {
    id: number;
    codigo: string;
    estado: string;
    indicios: Indicio[];
};

const ExpedienteList = () => {
    const [ expedientes, setExpedientes ] = useState<Expediente[]>([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchExpedientes = async () => {
            try {
                // Obtener expedientes
                const expRes = await fetch('http://localhost:3001/api/expedientes');
                const expData = await expRes.json();

                // Para cada expediente, obtener sus indicios
                const expedientesWithIndicios = await Promise.all(
                    expData.map(async (exp: Expediente) => {
                        const indRes = await fetch(`http://localhost:3001/api/indicios/expediente/${exp.id}`);
                        const indicios = await indRes.json();
                        return {
                            id: exp.id,
                            codigo: exp.codigo,
                            estado: exp.estado,
                            indicios
                        };
                    })
                );
                setExpedientes(expedientesWithIndicios);
            } catch (error) {
                console.error(error);
                setExpedientes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchExpedientes();
    }, []);

    if (loading) {
        return <div className="text-center mt-6">Cargando expedientes...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expedientes pendientes de revisión</h2>
            <ul className="space-y-4">
                {expedientes.map((exp) => (
                    <li key={exp.id} className="border-b pb-4">
                        <div className="flex justify-between items-center pb-2">
                            <div>
                                <p className="text-gray-700 font-medium">{exp.codigo}</p>
                                <p className="text-sm text-gray-500">{exp.estado}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Aprobar</button>
                                <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Rechazar</button>
                            </div>
                        </div>
                        {exp.indicios.length > 0 ? (
                            <div className="ml-4 mt-2">
                                <p className="font-semibold text-gray-600 mb-1">Indicios:</p>
                                <ul className="list-disc pl-5">
                                    {exp.indicios.map((ind) => (
                                        <li key={ind.id} className="text-sm text-gray-700">
                                            {ind.descripcion || 'Sin descripción'}
                                            {ind.color && <> | Color: {ind.color}</>}
                                            {ind.tamano && <> | Tamaño: {ind.tamano}</>}
                                            {ind.peso !== null && <> | Peso: {ind.peso}g</>}
                                            {ind.ubicacion && <> | Ubicación: {ind.ubicacion}</>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="ml-4 mt-2 text-sm text-gray-400">Sin indicios registrados.</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpedienteList;
