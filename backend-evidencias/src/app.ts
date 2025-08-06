import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import authRoutes from './routes/auth.routes';

const app = express();
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);

export default app;
