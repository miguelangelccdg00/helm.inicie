import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreBeneficios } from '../models/storeBeneficios';
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

    
    


}

export default new StoreSolucionesService();
