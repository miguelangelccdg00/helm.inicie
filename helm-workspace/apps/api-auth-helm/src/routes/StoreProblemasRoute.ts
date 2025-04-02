import { Router } from "express";
import storeProblemasController from "../controllers/StoreProblemasController";

const router = Router();

/**
 * @description Listado de problemas  */
router.get('/listCompleteProblemas', storeProblemasController.listProblema);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listProblemas/:idSolucion', storeProblemasController.listIdProblema);

/**
 * @description Insercion de problemas por solución específica de su ID
 */
router.post('/createProblema/:idSolucion', storeProblemasController.createProblema);

/**
 * @description Asociar un problema existente a una solución
 */
router.post('/asociarProblema', storeProblemasController.asociarProblema);

export default router;