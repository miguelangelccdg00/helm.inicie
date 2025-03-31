import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreSoluciones } from '../models/storeSoluciones';

class StoreSolucionesService 
{
    /** Obtiene los beneficios de una solución por su ID */
    async getByIdBeneficio(idSolucion: number) {
        const [rows] = await pool.promise().query(
            `SELECT b.*
            FROM storeBeneficios b
            JOIN storeSolucionesBeneficios sb ON b.id_beneficio = sb.id_beneficio
            JOIN storeSoluciones s ON sb.id_solucion = s.id_solucion
            WHERE s.id_solucion = ?`, [idSolucion]
        );

        return rows;
    }

    /**
     * Obtiene todas las soluciones almacenadas en la base de datos
     */
    async getAll() 
    {
        const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones');
        return rows;
    }

    /**
     * Obtiene una solución específica por su ID
     */
    async getById(id: number) 
    {
        const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones WHERE id_solucion = ?', [id]);
        return rows.length ? rows[0] : null;
    }

    /**
     * Actualiza una solución específica en la base de datos
     */
    async update(id: number, updateData: Partial<StoreSoluciones>) 
    {
        await pool.promise().query('UPDATE storeSoluciones SET ? WHERE id_solucion = ?', [updateData, id]);
        return { message: 'StoreSoluciones actualizado' };
    }
}

export default new StoreSolucionesService();
