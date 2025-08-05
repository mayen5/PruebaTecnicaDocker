import { useState } from 'react';

const IndicioForm = () => {
    const [ indicio, setIndicio ] = useState({
        descripcion: '',
        color: '',
        tamaño: '',
        peso: '',
        ubicacion: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIndicio({ ...indicio, [ e.target.name ]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Indicio enviado:', indicio);
        // Aquí puedes hacer el POST a /api/indicios
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Agregar Indicio</h2>
            <input name="descripcion" placeholder="Descripción" onChange={handleChange} />
            <input name="color" placeholder="Color" onChange={handleChange} />
            <input name="tamaño" placeholder="Tamaño" onChange={handleChange} />
            <input name="peso" placeholder="Peso" onChange={handleChange} />
            <input name="ubicacion" placeholder="Ubicación" onChange={handleChange} />
            <button type="submit">Agregar</button>
        </form>
    );
};

export default IndicioForm;
