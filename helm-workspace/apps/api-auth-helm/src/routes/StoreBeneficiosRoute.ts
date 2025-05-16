import { Router } from "express";
import storeBeneficiosController from "../controllers/StoreBeneficiosController";

const router = Router();

/**
 * @description Listado de beneficios  */
router.get('/listCompleteBeneficios', storeBeneficiosController.listCompleteBeneficios);

/**
 * @description Obtencion de beneficios por solución específica de su ID
 */
router.get('/listBeneficios/:idSolucion', storeBeneficiosController.listBeneficios);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listSolucionAmbitoBeneficio', storeBeneficiosController.listSolucionAmbitoBeneficio);

/**
 * @description Obtencion de problemas por solución específica de su ID
 */
router.get('/listSolucionAmbitoSectorBeneficio', storeBeneficiosController.listSolucionAmbitoSectorBeneficio);

/**
 * @description Insercion de beneficios por solución específica de su ID
 */
router.post('/createBeneficio/:idSolucion', storeBeneficiosController.createBeneficio);

/**
 * @description Asociar un beneficio existente a una solución
 */
router.post('/asociarBeneficio', storeBeneficiosController.asociarBeneficio);

/**
 * @description Asociar un problema existente a una solución
 */
router.post('/asociarSolucionAmbitoBeneficio', storeBeneficiosController.asociarSolucionAmbitoBeneficio);

/**
 * @description Asociar un problema existente a una solución
 */
router.post('/asociarSolucionAmbitoSectorBeneficio', storeBeneficiosController.asociarSolucionAmbitoSectorBeneficio);

/**
 * @description Modifica un beneficio específico por su ID
 */
router.put('/modifyStoreBeneficio/:id', storeBeneficiosController.modifyStoreBeneficios);

/**
 * @description Eliminacion de un beneficio específica por su ID
 */
router.delete('/deleteBeneficio/:idBeneficio', storeBeneficiosController.deleteBeneficio);

export default router;