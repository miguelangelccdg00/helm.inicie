import { Router } from 'express';
import loginController from '../controllers/LoginControllers';

const router = Router();

/**
 * @description Permite a un usuario iniciar sesión
 */
router.post('/loginUsuario', loginController.loginUsuario);

export default router;
