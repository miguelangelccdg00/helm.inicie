import { Router } from "express";
import storeAmbitosController from "../controllers/StoreAmbitosController";

const router = Router();

/**
 * @description Insercion de problemas por solución específica de su ID
 */
router.post('/createAmbito/:idSolucion', storeAmbitosController.createAmbitos);

export default router;