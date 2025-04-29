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
 * @description Modificación de los sectores asociados a una solución
 */
router.put('/modifySolucionSectores/:idSolucion', StoreSectoresController.modifySolucionSectores);


/**
 * @description Eliminación de la relación entre un sector y una solución
 */
router.delete('/deleteSolucionSector/:idSolucion/:idSector', StoreSectoresController.deleteSolucionSector);

/**
 * @description Eliminacion de un sector específico por su ID
 */
router.delete('/deleteSectores/:idSolucion/:idSector', StoreSectoresController.deleteSector);

export default router;