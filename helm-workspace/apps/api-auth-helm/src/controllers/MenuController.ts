import { pool } from '../../../api-shared-helm/src/databases/conexion.js';

class MenuController {
    constructor() {}

    getMenuItems = async (req, res) => {
        try {
            const [rows] = await pool.promise().query('SELECT * FROM menu_items');
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener elementos del menú: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    getSubMenuItems = async (req, res) => {
        try {
            const [rows] = await pool.promise().query('SELECT * FROM menu_submenus');
            res.json(rows);
        } catch (error) {
            console.error('Error al obtener submenús: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new MenuController();