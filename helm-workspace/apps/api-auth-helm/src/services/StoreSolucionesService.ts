import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreSoluciones } from '../../../api-shared-helm/src/models/storeSoluciones.js';

class StoreSolucionesService 
{
    /**
     * Obtiene todas las soluciones almacenadas en la base de datos
     */
    async getAll(): Promise<StoreSoluciones[]> 
    {
        const [rows] = await pool.promise().query(
            'SELECT id_solucion,description,title,subtitle,icon,slug,titleweb,multimediaUri,multimediaTypeId, problemaTitle, problemaPragma, solucionTitle,solucionPragma, caracteristicasTitle, caracteristicasPragma,casosdeusoTitle,casosdeusoPragma,firstCtaTitle,firstCtaPragma,secondCtaTitle,secondCtaPragma,beneficiosPragma,titleBeneficio FROM storeSoluciones'
        );
        return rows as StoreSoluciones[];
    }

    /**
     * Obtiene una solución específica por su ID
     */
    async getById(id: number): Promise<StoreSoluciones | null> 
    {
        const [rows] = await pool.promise().query(
            'SELECT id_solucion,description,title,subtitle,icon,slug,titleweb,multimediaUri,multimediaTypeId, problemaTitle, problemaPragma, solucionTitle,solucionPragma, caracteristicasTitle, caracteristicasPragma,casosdeusoTitle,casosdeusoPragma,firstCtaTitle,firstCtaPragma,secondCtaTitle,secondCtaPragma,beneficiosPragma,titleBeneficio FROM storeSoluciones WHERE id_solucion = ?',
            [id]
        );
        return rows.length ? (rows[0] as StoreSoluciones) : null;
    }

    /**
     * Actualiza una solución específica en la base de datos
     */
    async update(id: number, updateData: Partial<StoreSoluciones>): Promise<{ message: string }> 
    {
        await pool.promise().query('UPDATE storeSoluciones SET ? WHERE id_solucion = ?', [updateData, id]);
        return { message: 'StoreSoluciones actualizado' };
    }

    /**
     * Actualiza los ámbitos de una solución
     */
    async updateSolucionAmbitos(idSolucion: number, solucionAmbitos: any[]): Promise<{ message: string }> 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            for (const solucionAmbito of solucionAmbitos) {
                await conn.query(
                    'UPDATE storeSolucionesAmbitos SET ? WHERE id_solucion = ? AND id_ambito = ?',
                    [solucionAmbito, idSolucion, solucionAmbito.id_ambito]
                );
            }

            await conn.commit();
            return { message: 'Solución por ámbitos actualizada correctamente' };
        } 
        catch (error) 
        {
            await conn.rollback();
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

    /**
     * Elimina una solución específica de la base de datos
     */
    async deleteSolucion(id: number): Promise<{ message: string }> 
    {
        const conn = await pool.promise().getConnection(); // Inicia conexión
        try 
        {
            await conn.beginTransaction(); // Inicia transacción

            // Elimina referencias en `storePacksSoluciones`
            await conn.query('DELETE FROM storePacksSoluciones WHERE id_solucion = ?', [id]);

            // Eliminación de la solución
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
    async checkSolucionExists(id: number): Promise<boolean> 
    {
        const [rows] = await pool.promise().query(
            'SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?',
            [id]
        );
        return rows.length > 0;
    }

    /**
     * Elimina la asociación entre una solución y un problema
     */
    async removeProblemaFromSolucion(idSolucion: number, idProblema: number): Promise<{ message: string }> 
    {
        // Elimina solo la asociación en la tabla de relaciones
        await pool.promise().query(
            'DELETE FROM storeProblemasSoluciones WHERE id_solucion = ? AND id_problema = ?', 
            [idSolucion, idProblema]
        );
        return { message: 'Asociación entre problema y solución eliminada correctamente' };
    }

    /**
     * Elimina la asociación entre una solución y una característica
     */
    async removeCaracteristicaFromSolucion(idSolucion: number, idCaracteristica: number): Promise<{ message: string }> 
    {
         // Elimina solo la asociación en la tabla de relaciones
         await pool.promise().query(
            'DELETE FROM storeSolucionesCaracteristicas WHERE id_solucion = ? AND id_caracteristica = ?', 
            [idSolucion, idCaracteristica]
        );
        return { message: 'Asociación entre caracteristica y solución eliminada correctamente' };
    }

    /**
     * Elimina la asociación entre una solución y un ámbito
     */
    async removeAmbitoFromSolucion(idSolucion: number, idAmbito: number): Promise<{ message: string }> 
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
