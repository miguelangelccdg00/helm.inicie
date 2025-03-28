import { Router } from "express";
import menuController from '../controllers/MenuController';

const router = Router();

// Ruta para obtener todos los elementos del menú
router.get('/items', menuController.getMenuItems);

// Ruta para obtener todos los elementos de los submenús
router.get('/submenus', menuController.getSubMenuItems);

export default router;