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
 * @description Insercion de caracteristicas por solución específica de su ID
 */
router.post('/createCaracteristicas/:idSolucion', storeCaracteristicasController.createCaracteristicas);

/**
 * @description Asociar un problema existente a una solución
 */
router.post('/asociarCaracteristica', storeCaracteristicasController.asociarCaracteristica);

export default router;