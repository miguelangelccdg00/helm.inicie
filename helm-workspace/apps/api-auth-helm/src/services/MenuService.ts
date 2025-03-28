import poolPromise from '../../../api-shared-helm/src/databases/conexion.js';

class MenuService 
{
    /**
     * Obtiene todos los elementos del menú principal
     */
    async getMenuItems() 
    {
        try {
            // Obtener el pool resolviendo la promesa primero
            const pool = await poolPromise;
            if (!pool) {
                throw new Error('No se pudo obtener la conexión a la base de datos');
            }
            // Usar el pool para ejecutar la consulta
            const [rows] = await pool.execute('SELECT * FROM menu_items');
            return rows;
        } catch (error) {
            console.error('Error al obtener elementos del menú:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los elementos de los submenús
     */
    async getSubMenuItems() 
    {
        try {
            // Obtener el pool resolviendo la promesa primero
            const pool = await poolPromise;
            if (!pool) {
                throw new Error('No se pudo obtener la conexión a la base de datos');
            }
            // Usar el pool para ejecutar la consulta
            const [rows] = await pool.execute('SELECT * FROM menu_submenus');
            return rows;
        } catch (error) {
            console.error('Error al obtener elementos del submenú:', error);
            throw error;
        }
    }
}

export default new MenuService();