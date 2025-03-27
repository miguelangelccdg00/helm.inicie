import { Router } from "express";
import storeSolucionesController from '../controllers/StoreSolucionesControllers';

const router = Router();
router.get('/listStoreSoluciones', storeSolucionesController.listStoreSoluciones);
router.put('/modifyStoreSoluciones/:id', storeSolucionesController.modifyStoreSoluciones);
export default router;