import { promises } from 'dns';
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

    async getProblemas() 
    {
        const [rows] = await pool.promise().query(`SELECT * FROM storeProblemas `);
        return rows;
    }

    async getByIdProblemas(idSolucion: Number)
    {
        const [rows] = await pool.promise().query(
            `SELECT p.* 
            FROM storeProblemas p
            JOIN storeSolucionesProblemas sp ON p.id_problema = sp.id_problema
            WHERE sp.id_solucion = ?`, [idSolucion]
        );
        return rows;
    }

    async asociarProblema(idSolucion: number, idProblema: number) 
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

            // Verifica si el problema existe
            const [problemaExiste]: any = await conn.query(
                `SELECT id_problema FROM storeProblemas WHERE id_problema = ?`, [idProblema]);

            if (problemaExiste.length === 0) 
            {
                throw new Error(`El problema con id ${idProblema} no existe.`);
            }

            // Verifica si la relación ya existe
            const [relacionExiste]: any = await conn.query(
                `SELECT * FROM storeSolucionesProblemas WHERE id_solucion = ? AND id_problema = ?`, 
                [idSolucion, idProblema]);

            if (relacionExiste.length > 0) 
            {
                // La relación ya existe, no es necesario crearla de nuevo
                await conn.commit();
                return { idSolucion, idProblema, message: 'La relación ya existía' };
            }

            // Crea la relación entre la solución y el problema
            await conn.query(
                `INSERT INTO storeSolucionesProblemas (id_solucion, id_problema) VALUES (?, ?)`, 
                [idSolucion, idProblema]);

            await conn.commit();

            return { idSolucion, idProblema, message: 'Relación creada con éxito' };
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

    async deleteProblema(idProblema: number): Promise <boolean>
    {
        const conn = await pool.promise().getConnection();

        try 
        {
            await conn.beginTransaction();
            
            const [result]: any = await conn.query('DELETE FROM storeSolucionesProblemas WHERE id_problema = ?',[idProblema]);
            
            const [resultProblema]: any = await conn.query('DELETE FROM storeProblemas WHERE id_problema = ?', [idProblema]);
            
            await conn.commit();

            return result.affectedRows > 0 && resultProblema.affectedRows > 0;
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