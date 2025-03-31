import { Router } from "express";
import storeSolucionesController from '../controllers/StoreSolucionesControllers';

const router = Router();

/**
 * @description Obtiene todas las soluciones almacenadas
 */
router.get('/listStoreSoluciones', storeSolucionesController.listStoreSoluciones);

/**
 * @description Obtiene una solución específica por su ID
 */
router.get('/listIdStoreSoluciones/:id', storeSolucionesController.listIdStoreSoluciones);

/**
 * @description Modifica una solución específica por su ID
 */
router.put('/modifyStoreSoluciones/:id', storeSolucionesController.modifyStoreSoluciones);

/**
 * @description Eliminacion de una solución específica por su ID
 */
router.delete('/deleteSolucion/:id', storeSolucionesController.deleteSolucion);

/**
 * @description Obtencion de beneficios por solución específica de su ID
 */
router.get('/listBeneficios/:idSolucion', storeSolucionesController.listBeneficios);

/**
 * @description Insercion de beneficios por solución específica de su ID
 */
router.post('/createBeneficio/:idSolucion', storeSolucionesController.createBeneficio);

export default router;
