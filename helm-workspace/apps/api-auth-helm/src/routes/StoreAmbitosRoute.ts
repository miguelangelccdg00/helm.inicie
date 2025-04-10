import { Router } from "express";
import storeAmbitosController from "../controllers/StoreAmbitosController";

const router = Router();

/**
 * @description Listado de ambitos  */
router.get('/listCompleteAmbitos', storeAmbitosController.listAmbitos);

/**
 * @description Obtencion de ambitos por solución específica de su ID
 */
router.get('/listAmbitos/:idSolucion', storeAmbitosController.listIdAmbito);

/**
 * @description Obtencion de ambitos por solución específica de su ID
 */
router.get('/listAmbitosSolucion/:idSolucion', storeAmbitosController.getVariantesSolucionPorAmbito);

/**
 * @description Insercion de ambitos por solución específica de su ID
 */
router.post('/createAmbito/:idSolucion', storeAmbitosController.createAmbitos);

/**
 * @description Asociar un ambito existente a una solución
 */
router.post('/asociarAmbito', storeAmbitosController.asociarAmbito);

/**
 * @description Modifica un ambito específico por su ID
 */
router.put('/modifyAmbitos/:idSolucion/:idAmbito', storeAmbitosController.modifyStoreAmbitos);

/**
 * @description Eliminacion de un ambito específico por su ID
 */
router.delete('/deleteAmbito/:idAmbito', storeAmbitosController.deleteAmbito);

export default router;