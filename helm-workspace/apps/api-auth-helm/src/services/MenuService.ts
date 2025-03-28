import { pool } from '../../../api-shared-helm/src/databases/conexion.js';

class MenuService 
{
    async getMenuItems() 
    {
        const [rows] = await pool.promise().query('SELECT * FROM menu_items');
        return rows;
    }

    async getSubMenuItems() 
    {
        const [rows] = await pool.promise().query('SELECT * FROM menu_submenus');
        return rows;
    }
}

export default new MenuService();
