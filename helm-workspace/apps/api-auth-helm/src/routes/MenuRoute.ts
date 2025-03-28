import { Router } from "express";
import menuController from '../controllers/MenuController';

const router = Router();

/**
 * @description Obtiene todos los elementos del menú principal
 */
router.get('/items', menuController.getMenuItems);

/**
 * @description Obtiene todos los elementos de los submenús
 */
router.get('/submenus', menuController.getSubMenuItems);

export default router;
