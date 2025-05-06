import { pool } from '../../../api-shared-helm/src/databases/conexion.js'; 
import { StoreSoluciones } from '../../../api-shared-helm/src/models/storeSoluciones.js';
import { SolucionAmbitoSector } from '../../../api-shared-helm/src/models/solucionAmbitoSector.js';

class StoreSolucionesService 
{
    /**
     * Obtiene todas las soluciones almacenadas en la base de datos.
     * 
     * @returns {Promise<StoreSoluciones[]>} Lista de soluciones almacenadas en la base de datos.
     */
    async getAll(): Promise<StoreSoluciones[]> 
    {
        const [rows] = await pool.promise().query(
            'SELECT id_solucion,description,title,subtitle,icon,slug,titleweb,multimediaUri,multimediaTypeId, problemaTitle, problemaPragma, solucionTitle,solucionPragma, caracteristicasTitle, caracteristicasPragma,casosdeusoTitle,casosdeusoPragma,firstCtaTitle,firstCtaPragma,secondCtaTitle,secondCtaPragma,beneficiosPragma,titleBeneficio FROM storeSoluciones'
        );
        return rows as StoreSoluciones[];
    }

    /**
     * Obtiene una solución específica por su ID.
     * 
     * @param {number} id - ID de la solución a obtener.
     * @returns {Promise<StoreSoluciones | null>} La solución solicitada o null si no se encuentra.
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
     * Actualiza una solución específica en la base de datos.
     * 
     * @param {number} id - ID de la solución a actualizar.
     * @param {Partial<StoreSoluciones>} updateData - Datos de la solución a actualizar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que la solución fue actualizada correctamente.
     */
    async update(id: number, updateData: Partial<StoreSoluciones>): Promise<{ message: string }> 
    {
        await pool.promise().query('UPDATE storeSoluciones SET ? WHERE id_solucion = ?', [updateData, id]);
        return { message: 'StoreSoluciones actualizado' };
    }

    /**
     * Actualiza los ámbitos de una solución.
     * 
     * @param {number} idSolucion - ID de la solución a actualizar.
     * @param {any[]} solucionAmbitos - Lista de ámbitos a actualizar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que los ámbitos de la solución fueron actualizados.
     * 
     * @throws {Error} Si ocurre un error durante la transacción.
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
     * Actualiza los sectores de una solución.
     * 
     * @param {number} idSolucion - ID de la solución a actualizar.
     * @param {any[]} solucionSectores - Lista de sectores a actualizar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que los sectores de la solución fueron actualizados.
     * 
     * @throws {Error} Si ocurre un error durante la transacción.
     */
    async updateSolucionSector(idSolucion: number, solucionSectores: any[]): Promise<{ message: string }> 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            for (const solucionSector of solucionSectores)
            {
                await conn.query(
                    'UPDATE storeSolucionesSectores SET ? WHERE id_solucion = ? AND id_sector = ?',
                    [solucionSector, idSolucion, solucionSector.id_sector]
                );
            }

            await conn.commit();
            return { message: 'Solución por sectores actualizada correctamente' };
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
     * Actualiza los ámbitos y sectores de una solución.
     * 
     * @param {number} idSolucion - ID de la solución a actualizar.
     * @param {SolucionAmbitoSector[]} solucionAmbitosSectores - Lista de ámbitos y sectores a actualizar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que los ámbitos y sectores de la solución fueron actualizados.
     * 
     * @throws {Error} Si ocurre un error durante la transacción.
     */
    async updateSolucionAmbitosSector(idSolucion: number, solucionAmbitosSectores: SolucionAmbitoSector[]): Promise<{ message: string }> 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            for (const solucionAmbitoSector of solucionAmbitosSectores) 
            {
                await conn.query(
                    'UPDATE storeSolucionesAmbitosSectores SET ? WHERE id_solucion = ? AND id_ambito = ? AND id_sector = ?',
                    [
                        solucionAmbitoSector,
                        idSolucion,
                        solucionAmbitoSector.id_ambito,
                        solucionAmbitoSector.id_sector
                    ]
                );
            }

            await conn.commit();
            return { message: 'Solución por ámbitos y sectores actualizada correctamente' };
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
     * Elimina una solución específica de la base de datos.
     * 
     * @param {number} id - ID de la solución a eliminar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que la solución fue eliminada correctamente.
     * 
     * @throws {Error} Si ocurre un error durante la eliminación de la solución.
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
     * Verifica si una solución existe en la base de datos.
     * 
     * @param {number} id - ID de la solución a verificar.
     * @returns {Promise<boolean>} Devuelve true si la solución existe, de lo contrario, false.
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
     * Elimina la asociación entre una solución y un problema.
     * 
     * @param {number} idSolucion - ID de la solución de la que se quiere eliminar la asociación.
     * @param {number} idProblema - ID del problema asociado que se quiere eliminar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que la asociación fue eliminada correctamente.
     */
    async removeProblemaFromSolucion(idSolucion: number, idProblema: number): Promise<{ message: string }> 
    {
        await pool.promise().query(
            'DELETE FROM storeProblemasSoluciones WHERE id_solucion = ? AND id_problema = ?', 
            [idSolucion, idProblema]
        );
        return { message: 'Asociación entre problema y solución eliminada correctamente' };
    }

    /**
     * Elimina la asociación entre una solución y una característica.
     * 
     * @param {number} idSolucion - ID de la solución de la que se quiere eliminar la asociación.
     * @param {number} idCaracteristica - ID de la característica asociada que se quiere eliminar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que la asociación fue eliminada correctamente.
     */
    async removeCaracteristicaFromSolucion(idSolucion: number, idCaracteristica: number): Promise<{ message: string }> 
    {
         await pool.promise().query(
            'DELETE FROM storeSolucionesCaracteristicas WHERE id_solucion = ? AND id_caracteristica = ?', 
            [idSolucion, idCaracteristica]
        );
        return { message: 'Asociación entre caracteristica y solución eliminada correctamente' };
    }

    /**
     * Elimina la asociación entre una solución y un ámbito.
     * 
     * @param {number} idSolucion - ID de la solución de la que se quiere eliminar la asociación.
     * @param {number} idAmbito - ID del ámbito asociado que se quiere eliminar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que la asociación fue eliminada correctamente.
     */
    async removeAmbitoFromSolucion(idSolucion: number, idAmbito: number): Promise<{ message: string }> 
    {
         await pool.promise().query(
            'DELETE FROM storeSolucionesAmbitos WHERE id_solucion = ? AND id_ambito = ?', 
            [idSolucion, idAmbito]
        );
        return { message: 'Asociación entre ambito y solución eliminada correctamente' };
    }

    /**
     * Elimina la asociación entre una solución y un sector.
     * 
     * @param {number} idSolucion - ID de la solución de la que se quiere eliminar la asociación.
     * @param {number} idSector - ID del sector asociado que se quiere eliminar.
     * @returns {Promise<{ message: string }>} Mensaje indicando que la asociación fue eliminada correctamente.
     */
    async removeSectorFromSolucion(idSolucion: number, idSector: number): Promise<{ message: string }> 
    {
         await pool.promise().query(
            'DELETE FROM storeSolucionesSectores WHERE id_solucion = ? AND id_sector = ?', 
            [idSolucion, idSector]
        );
        return { message: 'Asociación entre sector y solución eliminada correctamente' };
    }
}

export default new StoreSolucionesService();
