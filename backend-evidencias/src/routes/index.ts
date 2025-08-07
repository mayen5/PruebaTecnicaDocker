import { Router } from 'express';
import authRoutes from '../auth/auth.routes';
import userRoutes from '../modules/usuario/usuario.routes';
import expedienteRoutes from '../modules/expediente/expediente.routes';
import indicioRoutes from '../modules/indicio/indicio.routes';
import healthRoutes from './health';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', userRoutes);
router.use('/expedientes', expedienteRoutes);
router.use('/indicios', indicioRoutes);
router.use('/health', healthRoutes);

export default router;
