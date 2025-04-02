import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreProblemas } from '../models/storeProblemas';

class StoreProblemasService
{
    async createProblema({ description, idSolucion}) 
    {
        const conn = await pool.promise().getConnection();

        try 
        {   
            await conn.beginTransaction();
            
            // Verifica si la solución existe antes de relacionarla
            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, [idSolucion]);

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            const [problemaResult]: any = await conn.query(
                `INSERT INTO storeProblemas (description) VALUES (?)`, [description]);

            const idProblema = problemaResult.insertId;

            await conn.query(
                `INSERT INTO storeSolucionesProblemas (id_solucion, id_problema) VALUES (?, ?)`, [idSolucion, idProblema]);

            await conn.commit();

            return { idProblema, idSolucion };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al insertar el problema:", error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }
}

export default new StoreProblemasService();