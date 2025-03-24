import { Router } from "express";
import{ loginUsuario } from '../controllers/loginController';

const router = Router();

router.post('/', loginUsuario);

export default router;

import { Router } from 'express';
import loginController from '../controllers/loginController';

