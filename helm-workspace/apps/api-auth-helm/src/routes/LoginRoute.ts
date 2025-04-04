import { Router } from 'express';
import loginController from '../controllers/LoginControllers';
import { verifyToken } from '../assets/authMiddleware';

const router = Router();

/**
 * @description Permite a un usuario iniciar sesión
 */
router.post('/loginUsuario', loginController.loginUsuario);

export default router;
