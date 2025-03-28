import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreSoluciones } from '../models/storeSoluciones';

class StoreSolucionesService 
{
    async getAll() 
    {
        const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones');
        return rows;
    }

    async getById(id: number) 
    {
        const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones WHERE id_solucion = ?', [id]);
        return rows.length ? rows[0] : null;
    }

    async update(id: number, updateData: Partial<StoreSoluciones>) 
    {
        await pool.promise().query('UPDATE storeSoluciones SET ? WHERE id_solucion = ?', [updateData, id]);
        return { message: 'StoreSoluciones actualizado' };
    }
}

export default new StoreSolucionesService();
