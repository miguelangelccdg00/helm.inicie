import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreBeneficios } from '../models/storeBeneficios';

class StoreBeneficiosServices
{
    async createBeneficio(storeBeneficio: any, idSolucion: number)
    {
        const connection = await pool.promise().getConnection();

        try 
        {
            await connection.beginTransaction();

            // Inserta el beneficio en storeBeneficios
            const [beneficioResult]: any = await connection.query(`INSERT INTO storeBeneficios SET ?`, [storeBeneficio]);

            const idBeneficio = beneficioResult.insertId;

            // Inserta la relación en storeSolucionesBeneficios
            await connection.query(`INSERT INTO storeSolucionesBeneficios (id_solucion, id_beneficio) VALUES (?, ?)`,[idSolucion, idBeneficio]);

            await connection.commit();
            return idBeneficio;
        }
        catch (error)
        {
            await connection.rollback();
            console.error("Error al insertar beneficio:", error);
            throw error;
        }
        finally 
        {
            connection.release();
        }
    }


    /** Obtiene los beneficios de una solución por su ID */
    async getByIdBeneficio(idSolucion: number)
    {
        const [rows] = await pool.promise().query(
            `SELECT b.* 
            FROM storeBeneficios b
            JOIN storeSolucionesBeneficios sb ON b.id_beneficio = sb.id_beneficio
            JOIN storeSoluciones s ON sb.id_solucion = s.id_solucion
            WHERE s.id_solucion = ?`, [idSolucion]
        );

        return rows;
    }

    async deleteBeneficio(idBeneficio: number): Promise<boolean> 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            // Elimina relaciones en storeSolucionesBeneficios
            await conn.query('DELETE FROM storeSolucionesBeneficios WHERE id_beneficio = ?', [idBeneficio]);

            // Elimina el beneficio de storeBeneficios
            const [result]: any = await conn.query('DELETE FROM storeBeneficios WHERE id_beneficio = ?',[idBeneficio]);

            await conn.commit();

            // Verifica si se eliminó algún registro
            return result.affectedRows > 0;
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error('Error al eliminar beneficio:', error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

}

export default new StoreBeneficiosServices();