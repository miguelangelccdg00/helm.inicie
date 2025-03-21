import { Router } from "express";
import { registrarUsuario } from "../controllers/registroController";

const router = Router();

router.post('/',registrarUsuario);

export default router;