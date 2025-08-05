import ExpedienteForm from '../components/ExpedienteForm';
import IndicioForm from '../components/IndicioForm';
import ExpedienteList from '../components/ExpedienteList';

const Home = () => {
    return (
        <div>
            <h1>Sistema de Gestión de Evidencias</h1>
            <ExpedienteForm />
            <hr />
            <IndicioForm />
            <hr />
            <ExpedienteList />
        </div>
    );
};

export default Home;
