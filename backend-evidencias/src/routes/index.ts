import { Router } from 'express';
import authRoutes from '../auth/auth.routes';
import userRoutes from '../modules/usuario/usuario.routes';
import healthRoutes from './health';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/health', healthRoutes);

export default router;
