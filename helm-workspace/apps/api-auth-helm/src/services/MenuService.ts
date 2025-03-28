import { pool } from '../../../api-shared-helm/src/databases/conexion.js';

class MenuService 
{
    /**
     * Obtiene todos los elementos del menú principal
     */
    async getMenuItems() 
    {
        const [rows] = await pool.promise().query('SELECT * FROM menu_items');
        return rows;
    }

    /**
     * Obtiene todos los elementos de los submenús
     */
    async getSubMenuItems() 
    {
        const [rows] = await pool.promise().query('SELECT * FROM menu_submenus');
        return rows;
    }
}

export default new MenuService();
