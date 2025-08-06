import { useState } from 'react';

interface Indicio {
    descripcion: string;
    color: string;
    tamaño: string;
    peso: string;
    ubicacion: string;
    tecnico: string;
}

interface Expediente {
    id: string;
    fechaRegistro: string;
    tecnico: string;
    indicios: Indicio[];
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    justificacion?: string;
}

const RevisarExpedientes = () => {
    const [ expedientes, setExpedientes ] = useState<Expediente[]>([
        {
            id: 'EXP001',
            fechaRegistro: '2025-08-05',
            tecnico: 'Técnico A',
            estado: 'pendiente',
            indicios: [
                {
                    descripcion: 'Teléfono Samsung',
                    color: 'Negro',
                    tamaño: 'Mediano',
                    peso: '150g',
                    ubicacion: 'Habitación principal',
                    tecnico: 'Técnico A'
                }
            ]
        }
    ]);

    const [ rechazoJustificacion, setRechazoJustificacion ] = useState('');
    const [ expedienteRechazando, setExpedienteRechazando ] = useState<string | null>(null);

    const aprobarExpediente = (id: string) => {
        setExpedientes(prev =>
            prev.map(e => (e.id === id ? { ...e, estado: 'aprobado' } : e))
        );
    };

    const prepararRechazo = (id: string) => {
        setExpedienteRechazando(id);
        setRechazoJustificacion('');
    };

    const confirmarRechazo = () => {
        if (expedienteRechazando && rechazoJustificacion.trim() !== '') {
            setExpedientes(prev =>
                prev.map(e =>
                    e.id === expedienteRechazando
                        ? { ...e, estado: 'rechazado', justificacion: rechazoJustificacion }
                        : e
                )
            );
            setExpedienteRechazando(null);
            setRechazoJustificacion('');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-6">Revisión de Expedientes</h2>

            {expedientes.map(expediente => (
                <div key={expediente.id} className="mb-6 p-4 border border-gray-300 rounded-md shadow-sm bg-white">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        Expediente: {expediente.id}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Fecha de registro: {expediente.fechaRegistro}</p>
                    <p className="text-sm text-gray-600 mb-3">Técnico: {expediente.tecnico}</p>

                    <h4 className="font-medium text-gray-700 mb-2">Indicios:</h4>
                    <ul className="pl-5 list-disc text-sm text-gray-700 mb-4">
                        {expediente.indicios.map((indicio, index) => (
                            <li key={index}>
                                <strong>{indicio.descripcion}</strong> – Color: {indicio.color}, Tamaño: {indicio.tamaño}, Peso: {indicio.peso}, Ubicación: {indicio.ubicacion}
                            </li>
                        ))}
                    </ul>

                    {expediente.estado === 'pendiente' ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => aprobarExpediente(expediente.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Aprobar
                            </button>
                            <button
                                onClick={() => prepararRechazo(expediente.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Rechazar
                            </button>
                        </div>
                    ) : (
                        <div className="mt-2 text-sm font-medium text-gray-700">
                            Estado: <span className={`font-bold ${expediente.estado === 'aprobado' ? 'text-green-700' : 'text-red-700'}`}>{expediente.estado.toUpperCase()}</span>
                            {expediente.estado === 'rechazado' && (
                                <div className="mt-1 text-red-700 italic">Justificación: {expediente.justificacion}</div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {expedienteRechazando && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4 text-red-700">Justificación del Rechazo</h3>
                        <textarea
                            value={rechazoJustificacion}
                            onChange={e => setRechazoJustificacion(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2 mb-4"
                            placeholder="Describa el motivo del rechazo..."
                        ></textarea>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setExpedienteRechazando(null)}
                                className="text-gray-600 hover:underline"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarRechazo}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevisarExpedientes;
