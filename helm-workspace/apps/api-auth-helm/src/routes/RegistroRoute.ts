import { Router } from 'express';
import registrarController from '../controllers/RegistroControllers';

const router = Router();

/**
 * @description Registra un nuevo usuario en el sistema
 */
router.post('/registrarUsuario', registrarController.registrarUsuario);

export default router;
