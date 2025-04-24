import { Router } from "express";
import storeAmbitosController from "../controllers/StoreAmbitosController";
import storeSolucionesController from "../controllers/StoreSolucionesControllers";

const router = Router();

/**
 * @description Listado de ambitos  */
router.get('/listCompleteAmbitos', storeAmbitosController.listAmbitos);

/**
 * @description Obtencion de ambitos por solución específica de su ID
 */
router.get('/listAmbitos/:idSolucion', storeAmbitosController.listIdAmbito);

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
 * @description Actualiza los ámbitos de una solución
 */
router.put('/modifyAmbitos/:id', storeSolucionesController.updateSolucionAmbitos);

/**
 * @description Eliminacion de un ambito específico por su ID
 */
router.delete('/deleteAmbito/:idAmbito', storeAmbitosController.deleteAmbito);

export default router;