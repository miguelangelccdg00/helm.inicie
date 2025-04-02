import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreBeneficios } from '../models/storeBeneficios';

class StoreBeneficiosServices 
{
    async createBeneficio({ description, idSolucion }) 
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

            const [beneficioResult]: any = await conn.query(
                `INSERT INTO storeBeneficios (description) VALUES (?)`, [description]);

            const idBeneficio = beneficioResult.insertId;

            await conn.query(
                `INSERT INTO storeSolucionesBeneficios (id_solucion, id_beneficio) VALUES (?, ?)`, [idSolucion, idBeneficio]);

            await conn.commit();

            return { idBeneficio, idSolucion };
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

    async getBeneficio() 
    {
        const [rows] = await pool.promise().query(`SELECT * FROM storeBeneficios `);
        return rows;
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

            // Solo elimina la relación en storeSolucionesBeneficios
            const [result]: any = await conn.query('DELETE FROM storeSolucionesBeneficios WHERE id_beneficio = ?', [idBeneficio]);

            await conn.commit();

            // Verifica si se eliminó algún registro
            return result.affectedRows > 0;
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error('Error al eliminar la asociación del beneficio:', error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

    async asociarBeneficio(idSolucion: number, idBeneficio: number) 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            // Verifica si la solución existe
            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, [idSolucion]);

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            // Verifica si el beneficio existe
            const [beneficioExiste]: any = await conn.query(
                `SELECT id_beneficio FROM storeBeneficios WHERE id_beneficio = ?`, [idBeneficio]);

            if (beneficioExiste.length === 0) 
            {
                throw new Error(`El beneficio con id ${idBeneficio} no existe.`);
            }

            // Verifica si la relación ya existe
            const [relacionExiste]: any = await conn.query(
                `SELECT * FROM storeSolucionesBeneficios WHERE id_solucion = ? AND id_beneficio = ?`, 
                [idSolucion, idBeneficio]);

            if (relacionExiste.length > 0) 
            {
                // La relación ya existe, no es necesario crearla de nuevo
                await conn.commit();
                return { idSolucion, idBeneficio, message: 'La relación ya existía' };
            }

            // Crea la relación entre la solución y el beneficio
            await conn.query(
                `INSERT INTO storeSolucionesBeneficios (id_solucion, id_beneficio) VALUES (?, ?)`, 
                [idSolucion, idBeneficio]);

            await conn.commit();

            return { idSolucion, idBeneficio, message: 'Relación creada con éxito' };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al asociar beneficio:", error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }
}

export default new StoreBeneficiosServices();