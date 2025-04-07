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
 * @description Insercion de beneficios por solución específica de su ID
 */
router.post('/createBeneficio/:idSolucion', storeBeneficiosController.createBeneficio);

/**
 * @description Asociar un beneficio existente a una solución
 */
router.post('/asociarBeneficio', storeBeneficiosController.asociarBeneficio);

/**
 * @description Modifica un beneficio específico por su ID
 */
router.put('/modifyStoreBeneficio/:id', storeBeneficiosController.modifyStoreBeneficios);

/**
 * @description Eliminacion de un beneficio específica por su ID
 */
router.delete('/deleteBeneficio/:idBeneficio', storeBeneficiosController.deleteBeneficio);

export default router;