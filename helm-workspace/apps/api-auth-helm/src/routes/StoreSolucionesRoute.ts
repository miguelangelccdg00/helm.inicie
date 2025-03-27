import { Router } from "express";
import storeSolucionesController from '../controllers/StoreSolucionesControllers';

const router = Router();
router.get('/listStoreSoluciones', storeSolucionesController.listStoreSoluciones);
export default router;