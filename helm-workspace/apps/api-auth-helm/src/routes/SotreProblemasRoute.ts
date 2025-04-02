import { Router } from "express";
import storeProblemasController from "../controllers/StoreProblemasController";

const router = Router();

/**
 * @description Insercion de problemas por solución específica de su ID
 */
router.post('/createProblema/:idSolucion', storeProblemasController.createProblema);

export default router;