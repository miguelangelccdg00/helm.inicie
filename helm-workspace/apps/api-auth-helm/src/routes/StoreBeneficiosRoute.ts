import { Router } from "express";
import storeBeneficiosController from "../controllers/StoreBeneficiosController";

const router = Router();

/**
 * @description Obtencion de beneficios por solución específica de su ID
 */
router.get('/listBeneficios/:idSolucion', storeBeneficiosController.listBeneficios);

/**
 * @description Insercion de beneficios por solución específica de su ID
 */
router.post('/createBeneficio', storeBeneficiosController.createBeneficio);

/**
 * @description Eliminacion de un beneficio específica por su ID
 */
router.delete('/deleteBeneficio/:idBeneficio', storeBeneficiosController.deleteBeneficio);

export default router;