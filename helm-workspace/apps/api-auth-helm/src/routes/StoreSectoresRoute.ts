import { Router } from "express";
import StoreSectoresController from "../controllers/StoreSectoresController";
import storeSolucionesController from "../controllers/StoreSolucionesControllers";

const router = Router();

/**
 * @description Listado de sectores  */
router.get('/listCompleteSectores', StoreSectoresController.listSectores);

/**
 * @description Obtencion de sectores por solución específica de su ID
 */
router.get('/listSectores/:idSolucion', StoreSectoresController.listIdSector);

/**
 * @description Obtencion de sectores por solución específica de su ID
 */
router.get('/listSectoresSolucion/:idSolucion', StoreSectoresController.getVariantesSolucionPorSector);

/**
 * @description Insercion de sectores por solución específica de su ID
 */
router.post('/createSectores/:idSolucion', StoreSectoresController.createSectores);

/**
 * @description Asociar un sectores existente a una solución
 */
router.post('/asociarSectores', StoreSectoresController.asociarSector);

export default router;