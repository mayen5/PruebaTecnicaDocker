import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './swagger';
import healthRoutes from './routes/health';
import authRoutes from './auth/auth.routes';
import userRoutes from './modules/usuario/user.routes';

import { errorHandler, notFound, logger } from './middlewares';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());

// Middleware general
app.use(logger);

// Rutas principales
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de errores y 404
app.use(notFound);
app.use(errorHandler);

export default app;
