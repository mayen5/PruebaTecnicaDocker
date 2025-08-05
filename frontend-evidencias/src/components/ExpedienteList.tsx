const ExpedienteList = () => {
    const expedientes = [
        { id: 1, numero: 'EXP-001', estado: 'En revisión' },
        { id: 2, numero: 'EXP-002', estado: 'En revisión' }
    ];

    return (
        <div>
            <h2>Expedientes pendientes de revisión</h2>
            <ul>
                {expedientes.map((exp) => (
                    <li key={exp.id}>
                        {exp.numero} - {exp.estado}
                        <button>Aprobar</button>
                        <button>Rechazar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpedienteList;
