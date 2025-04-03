import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreProblemas } from '../models/storeProblemas';

class StoreProblemasService 
{
    /**
     * Crea un problema y lo asocia con una solución existente.
     */
    async createProblema({ description, titulo, idSolucion }) 
    {
        const conn = await pool.promise().getConnection();

        try 
        {
            await conn.beginTransaction();
            
            // Verifica si la solución existe antes de relacionarla
            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, 
                [idSolucion]
            );

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            // Inserta el problema en la base de datos (solo description, sin titulo)
            const [problemaResult]: any = await conn.query(
                `INSERT INTO storeProblemas (description) VALUES (?)`, 
                [description]
            );

            const idProblema = problemaResult.insertId;

            // Relaciona el problema con la solución
            await conn.query(
                `INSERT INTO storeSolucionesProblemas (id_solucion, id_problema) VALUES (?, ?)`, 
                [idSolucion, idProblema]
            );

            // Actualiza los campos problemaTitle y problemaPragma en la solución
            await conn.query(
                `UPDATE storeSoluciones SET problemaTitle = ?, problemaPragma = ? WHERE id_solucion = ?`,
                [titulo, description, idSolucion]
            );

            await conn.commit();

            return { idProblema, idSolucion, description, titulo };
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

    /**
     * Obtiene la lista de todos los problemas registrados.
     */
    async getProblemas() 
    {
        const [rows] = await pool.promise().query(`SELECT * FROM storeProblemas`);
        return rows;
    }

    /**
     * Obtiene un problema específico por su ID.
     */
    async getProblemaById(idProblema: number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT * FROM storeProblemas WHERE id_problema = ?`, 
            [idProblema]
        );
        return rows.length ? rows[0] : null;
    }

    /**
     * Obtiene los problemas asociados a una solución específica.
     */
    async getByIdProblemas(idSolucion: Number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT p.* 
             FROM storeProblemas p
             JOIN storeSolucionesProblemas sp ON p.id_problema = sp.id_problema
             WHERE sp.id_solucion = ?`, 
            [idSolucion]
        );
        return rows;
    }

    /**
     * Asocia un problema existente con una solución existente.
     */
    async asociarProblema(idSolucion: number, idProblema: number, titulo?: string) 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            // Verifica si la solución existe
            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, 
                [idSolucion]
            );

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            // Verifica si el problema existe y obtiene sus datos
            const [problemaExiste]: any = await conn.query(
                `SELECT * FROM storeProblemas WHERE id_problema = ?`, 
                [idProblema]
            );

            if (problemaExiste.length === 0) 
            {
                throw new Error(`El problema con id ${idProblema} no existe.`);
            }

            // Verifica si la relación ya existe
            const [relacionExiste]: any = await conn.query(
                `SELECT * FROM storeSolucionesProblemas WHERE id_solucion = ? AND id_problema = ?`, 
                [idSolucion, idProblema]
            );

            if (relacionExiste.length > 0) 
            {
                await conn.commit();
                return { idSolucion, idProblema, message: 'La relación ya existía' };
            }

            // Crea la relación entre la solución y el problema
            await conn.query(
                `INSERT INTO storeSolucionesProblemas (id_solucion, id_problema) VALUES (?, ?)`, 
                [idSolucion, idProblema]
            );

            // Actualiza los campos problemaTitle y problemaPragma en la solución
            const problema = problemaExiste[0];
            await conn.query(
                `UPDATE storeSoluciones SET problemaTitle = ?, problemaPragma = ? WHERE id_solucion = ?`,
                [titulo || "Problema sin título", problema.description, idSolucion]
            );

            await conn.commit();

            return { idSolucion, idProblema, titulo, message: 'Relación creada con éxito' };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al asociar problema:", error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

    /**
     * Elimina la asociación de un problema con una solución sin eliminar el problema.
     */
    async deleteProblema(idProblema: number): Promise<boolean> 
    {
        const conn = await pool.promise().getConnection();

        try 
        {
            await conn.beginTransaction();
            
            // Solo elimina la asociación, mantiene el problema en la base de datos
            const [result]: any = await conn.query('DELETE FROM storeSolucionesProblemas WHERE id_problema = ?', [idProblema]);
            
            await conn.commit();

            return result.affectedRows > 0;
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error('Error al eliminar la asociación del problema:', error);
            throw error;
        }
        finally 
        {
            conn.release();
        }
    }
}

export default new StoreProblemasService();