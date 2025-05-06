import { pool } from '../../../api-shared-helm/src/databases/conexion.js';

class MenuService 
{
    /** 
     * Obtiene todos los elementos del menú principal.
     * 
     * @returns {Promise<Array>} Una lista de objetos que representan los elementos del menú principal, incluyendo el ID, título, icono, posición, orden, ruta, categoría del submenú, contador de notificaciones y estado de actividad.
     * 
     * @throws {Error} Si ocurre un error al consultar la base de datos.
     */
    async getMenuItems() 
    {
        const [rows] = await pool.promise().query('SELECT id,titulo,icono,posicion,orden,ruta,categoria_submenu,contador_notificaciones,activo FROM menu_items');
        return rows;
    }

    /** 
     * Obtiene todos los elementos de los submenús.
     * 
     * @returns {Promise<Array>} Una lista de objetos que representan los elementos de los submenús, incluyendo el ID, título, categoría, ruta, orden y estado de actividad.
     * 
     * @throws {Error} Si ocurre un error al consultar la base de datos.
     */
    async getSubMenuItems() 
    {
        const [rows] = await pool.promise().query('SELECT id, titulo, categoria, ruta, orden, activo FROM menu_submenus');
        return rows;
    }
}

export default new MenuService();
