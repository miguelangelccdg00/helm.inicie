import { Router } from 'express';
import registrarController from '../controllers/RegistroControllers';

const router = Router();
router.post('/', registrarController.registrarUsuario);
export default router;
