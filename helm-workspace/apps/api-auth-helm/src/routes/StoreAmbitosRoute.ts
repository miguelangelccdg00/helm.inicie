import { Router } from "express";
import storeAmbitosController from "../controllers/StoreAmbitosController";

const router = Router();

/**
 * @description Listado de ambitos  */
router.get('/listCompleteAmbitos', storeAmbitosController.listAmbitos);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listAmbitos/:idSolucion', storeAmbitosController.listIdAmbito);

/**
 * @description Insercion de problemas por solución específica de su ID
 */
router.post('/createAmbito/:idSolucion', storeAmbitosController.createAmbitos);

export default router;