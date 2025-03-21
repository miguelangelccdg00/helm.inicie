import { Router } from "express";
import{ loginUsuario } from '../controllers/loginController';

const router = new Router();

router.post('/', loginUsuario);

export default router;