import { Router } from 'express';
import loginController from '../controllers/LoginControllers';


const router = Router();
router.post('/loginUsuario', loginController.loginUsuario);
export default router;
