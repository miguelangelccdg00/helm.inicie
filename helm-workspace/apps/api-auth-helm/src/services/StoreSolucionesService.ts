import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreSoluciones } from '../models/storeSoluciones';

class StoreSolucionesService 
{
    /**
     * Obtiene todas las soluciones almacenadas en la base de datos
     */
    async getAll() 
    {
        const [rows] = await pool.query('SELECT * FROM storeSoluciones');
        return rows;
    }

    /**
     * Obtiene una solución específica por su ID
     */
    async getById(id: number) 
    {
        const [rows] = await pool.query('SELECT * FROM storeSoluciones WHERE id_solucion = ?', [id]);
        return rows.length ? rows[0] : null;
    }

    /**
     * Actualiza una solución específica en la base de datos
     */
    async update(id: number, updateData: Partial<StoreSoluciones>) 
    {
        await pool.query('UPDATE storeSoluciones SET ? WHERE id_solucion = ?', [updateData, id]);
        return { message: 'StoreSoluciones actualizado' };
    }
}

export default new StoreSolucionesService();
