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

/**
 * @description Modificacion de un sector de una solucion especifica
 */

router.put('/modifySectores/:idSolucion/:idSector', StoreSectoresController.modifyStoreSectores)


/**
 * @description Actualiza los ámbitos de una solución
 */
router.put('/modifySolucionSectores/:id', storeSolucionesController.updateSolucionSectores);

/**
 * @description Eliminacion de un ambito específico por su ID
 */
router.delete('/deleteSectores/:idSectores', StoreSectoresController.deleteSector);
/**deleteSectorSolucion */

/**
 * @description Eliminacion de un ambito específico por su ID
 */
router.delete('/deleteSectorSolucion/:idSolucion/:idSectores', StoreSectoresController.removeSectorFromSolucion);

export default router;