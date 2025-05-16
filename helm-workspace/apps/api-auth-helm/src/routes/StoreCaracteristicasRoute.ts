import { Router } from "express";
import storeCaracteristicasController from "../controllers/StoreCaracteristicasController";

const router = Router();

/**
 * @description Listado de caracteristicas  */
router.get('/listCompleteCaracteristicas', storeCaracteristicasController.listCaracteristica);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listCaracteristicas/:idSolucion', storeCaracteristicasController.listIdCaracteristica);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listSolucionAmbitoCaracteristica', storeCaracteristicasController.listSolucionAmbitoCaracteristica);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listSolucionAmbitoSectorCaracteristica', storeCaracteristicasController.listSolucionAmbitoSectorCaracteristica);

/**
 * @description Insercion de caracteristicas por solución específica de su ID
 */
router.post('/createCaracteristicas/:idSolucion', storeCaracteristicasController.createCaracteristicas);

/**
 * @description Asociar un problema existente a una solución
 */
router.post('/asociarCaracteristica', storeCaracteristicasController.asociarCaracteristica);

/**
 * @description Asociar un problema existente a una solución
 */
router.post('/asociarSolucionAmbitoCaracteristica', storeCaracteristicasController.asociarSolucionAmbitoCaracteristica);

/**
 * @description Modifica un beneficio específico por su ID
 */
router.put('/modifyStoreCaracteristica/:id', storeCaracteristicasController.modifyStoreCaracteristicas);

/**
 * @description Eliminacion de una caracteristica específica por su ID
 */
router.delete('/deleteCaracteristicas/:idCaracteristica', storeCaracteristicasController.deleteCaracteristica);

export default router;