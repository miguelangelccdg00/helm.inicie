import { Router } from 'express';
import registrarController from '../controllers/RegistroControllers';

const router = Router();
router.post('/registrarUsuario', registrarController.registrarUsuario);
export default router;
