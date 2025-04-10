import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreSoluciones } from '../models/storeSoluciones';

class StoreSolucionesService 
{    
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

    /**
     * Elimina una solución específica de la base de datos
     */
    async deleteSolucion(id: number) 
    {
        const conn = await pool.promise().getConnection(); // Inicia conexión
        try 
        {
            await conn.beginTransaction(); // Inicia transacción

            // Elimina referencias en `storePacksSoluciones`
            await conn.query('DELETE FROM storePacksSoluciones WHERE id_solucion = ?', [id]);

            // Eliminacion la solución
            await conn.query('DELETE FROM storeSoluciones WHERE id_solucion = ?', [id]);

            await conn.commit(); // Confirmar cambios
            return { message: 'Solución eliminada correctamente' };
        } 
        catch (error) 
        {
            // Revertir cambios en caso de error
            await conn.rollback(); 
            throw error;
        } 
        finally 
        {
            // Liberar conexión
            conn.release(); 
        }
    }

    /**
     * Verifica si una solución existe en la base de datos
     */
    async checkSolucionExists(id: number) 
    {
        const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones WHERE id_solucion = ?', [id]);
        return rows.length > 0;
    }

    /**
     * Elimina la asociación entre una solución y un problema
     */
    async removeProblemaFromSolucion(idSolucion: number, idProblema: number) 
    {
        // Elimina solo la asociación en la tabla de relaciones
        await pool.promise().query(
            'DELETE FROM storeProblemasSoluciones WHERE id_solucion = ? AND id_problema = ?', 
            [idSolucion, idProblema]
        );
        return { message: 'Asociación entre problema y solución eliminada correctamente' };
    }

    async removeCaracteristicaFromSolucion(idSolucion: number, idCaracteristica: number)
    {
         // Elimina solo la asociación en la tabla de relaciones
         await pool.promise().query(
            'DELETE FROM storeSolucionesCaracteristicas WHERE id_solucion = ? AND id_caracteristica = ?', 
            [idSolucion, idCaracteristica]
        );
        return { message: 'Asociación entre caracteristica y solución eliminada correctamente' };
    }

    async removeAmbitoFromSolucion(idSolucion: number, idAmbito: number)
    {
         // Elimina solo la asociación en la tabla de relaciones
         await pool.promise().query(
            'DELETE FROM storeSolucionesAmbitos WHERE id_solucion = ? AND id_ambito = ?', 
            [idSolucion, idAmbito]
        );
        return { message: 'Asociación entre ambito y solución eliminada correctamente' };
    }
}

export default new StoreSolucionesService();