import { Request, Response } from 'express';
import MenuService from '../services/MenuService';

class MenuController
{
    /**
     * Obtiene todos los elementos del menú principal.
     * 
     * @param req - No se requieren parámetros.
     * @param res - Devuelve un arreglo de elementos del menú principal o un error.
     * @returns {Promise<void>} Una promesa que resuelve cuando se envía la respuesta.
     */
    async getMenuItems(req: Request, res: Response): Promise<void>
    {
        try
        {
            const menuItems = await MenuService.getMenuItems();
            res.json(menuItems);
        }
        catch (error)
        {
            console.error('Error al obtener elementos del menú: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    /**
     * Obtiene todos los elementos del submenú.
     * 
     * @param req - No se requieren parámetros.
     * @param res - Devuelve un arreglo de submenús o un error.
     * @returns {Promise<void>} Una promesa que resuelve cuando se envía la respuesta.
     */
    async getSubMenuItems(req: Request, res: Response): Promise<void>
    {
        try
        {
            const subMenuItems = await MenuService.getSubMenuItems();
            res.json(subMenuItems);
        }
        catch (error)
        {
            console.error('Error al obtener submenús: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new MenuController();
