const ExpedienteList = () => {
    const expedientes = [
        { id: 1, numero: 'EXP-001', estado: 'En revisión' },
        { id: 2, numero: 'EXP-002', estado: 'En revisión' }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expedientes pendientes de revisión</h2>
            <ul className="space-y-4">
                {expedientes.map((exp) => (
                    <li key={exp.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                            <p className="text-gray-700 font-medium">{exp.numero}</p>
                            <p className="text-sm text-gray-500">{exp.estado}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Aprobar</button>
                            <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700">Rechazar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpedienteList;
