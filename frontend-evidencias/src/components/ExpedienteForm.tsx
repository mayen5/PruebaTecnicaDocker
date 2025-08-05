import { useState } from 'react';

const ExpedienteForm = () => {
    const [ expediente, setExpediente ] = useState({
        numero: '',
        tecnico: '',
        fecha: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpediente({ ...expediente, [ e.target.name ]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Expediente enviado:', expediente);
        // Aquí puedes hacer el POST a /api/expedientes
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Expediente</h2>
            <input name="numero" placeholder="Número de expediente" onChange={handleChange} />
            <input name="tecnico" placeholder="Técnico responsable" onChange={handleChange} />
            <input name="fecha" type="date" onChange={handleChange} />
            <button type="submit">Guardar</button>
        </form>
    );
};

export default ExpedienteForm;
