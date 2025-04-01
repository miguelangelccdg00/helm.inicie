import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreBeneficios } from '../models/storeBeneficios';

class StoreBeneficiosServices 
{
    async createBeneficio({description, title, idSolucion}) 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            // Insertar el beneficio en storeBeneficios
            const [beneficioResult]: any = await conn.query(
                `INSERT INTO storeBeneficios (description, title) VALUES (?, ?)`,[description, title]);

            const idBeneficio = beneficioResult.insertId;

            // Relacionar el beneficio con la solución en storeSolucionesBeneficios
            await conn.query(
                `INSERT INTO storeSolucionesBeneficios (id_solucion, id_beneficio) VALUES (?, ?)`, [idSolucion, idBeneficio]);

            // Confirmar la transacción
            await conn.commit();

            return { idBeneficio };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al insertar beneficio:", error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

    /** Obtiene los beneficios de una solución por su ID */
    async getByIdBeneficio(idSolucion: number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT b.* 
            FROM storeBeneficios b
            JOIN storeSolucionesBeneficios sb ON b.id_beneficio = sb.id_beneficio
            WHERE sb.id_solucion = ?`, 
            [idSolucion]
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
            const [result]: any = await conn.query('DELETE FROM storeBeneficios WHERE id_beneficio = ?', [idBeneficio]);

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
