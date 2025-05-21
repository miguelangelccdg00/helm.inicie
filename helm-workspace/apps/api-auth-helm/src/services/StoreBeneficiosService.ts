import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreBeneficios } from '../../../api-shared-helm/src/models/storeBeneficios.js';
import { AppError } from '../../../api-shared-helm/src/models/AppError';

/**
 * DTO para la creación de un nuevo beneficio.
 * @interface CreateBeneficioDTO
 */
interface CreateBeneficioDTO
{
  description: string;
  idSolucion: number;
}


interface AsociarSolucionAmbitoBeneficioBody 
{
  id_solucion: number;
  id_ambito: number;
  id_beneficio: number;
}

interface AsociarSolucionAmbitoSectorBeneficioBody 
{
  id_solucion: number;
  id_ambito: number;
  id_sector: number;
  id_beneficio: number;
}

/**
 * Resultado de asociar un beneficio a una solución.
 * @interface AsociarBeneficioResult
 */
interface AsociarBeneficioResult
{
  idSolucion: number;
  idBeneficio: number;
  message: string;
}

/**
 * Servicios relacionados con los beneficios de la tienda.
 * @class StoreBeneficiosServices
 */
class StoreBeneficiosServices
{
  /**
   * Crea un nuevo beneficio y lo asocia a una solución.
   * 
   * @param {CreateBeneficioDTO} params - Parámetros para la creación del beneficio.
   * @returns {Promise<{ idBeneficio: number; idSolucion: number }>} El ID del beneficio creado y el ID de la solución.
   * @throws {AppError} Si la solución no existe o si ocurre un error durante la transacción.
   */
  async createBeneficio({ description, idSolucion }: CreateBeneficioDTO): Promise<{ idBeneficio: number; idSolucion: number }>
  {
    const conn = await pool.promise().getConnection();
    try
    {
      await conn.beginTransaction();

      const [solucionExiste]: [{ id_solucion: number }[]] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new AppError(`La solución con id ${idSolucion} no existe.`, 404);
      }

      const [beneficioResult]: any = await conn.query(
        `INSERT INTO storeBeneficios (description) VALUES (?)`,
        [description]
      );

      const idBeneficio = beneficioResult.insertId;

      await conn.query(
        `INSERT INTO storeSolucionesBeneficios (id_solucion, id_beneficio) VALUES (?, ?)`,
        [idSolucion, idBeneficio]
      );

      await conn.commit();

      return { idBeneficio, idSolucion };
    }
    catch (error)
    {
      await conn.rollback();
      console.error("Error al insertar beneficio:", error);
      throw new AppError("Error al crear el beneficio", 500);
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Obtiene todos los beneficios disponibles.
   * 
   * @returns {Promise<StoreBeneficios[]>} Lista de todos los beneficios.
   */
  async getBeneficio(): Promise<StoreBeneficios[]>
  {
    try
    {
      const [rows] = await pool.promise().query(`SELECT id_beneficio, description FROM storeBeneficios`);
      return rows as StoreBeneficios[];
    }
    catch (error)
    {
      console.error("Error al obtener beneficios:", error);
      throw new AppError("Error al obtener beneficios", 500);
    }
  }

  /**
   * Obtiene los beneficios asociados a una solución.
   * 
   * @param {number} idSolucion - El ID de la solución.
   * @returns {Promise<StoreBeneficios[]>} Lista de beneficios asociados a la solución.
   */
  async getByIdBeneficio(idSolucion: number): Promise<StoreBeneficios[]>
  {
    try
    {
      const [rows] = await pool.promise().query(
        `SELECT b.id_beneficio, b.description
         FROM storeBeneficios b
         JOIN storeSolucionesBeneficios sb ON b.id_beneficio = sb.id_beneficio
         WHERE sb.id_solucion = ?`,
        [idSolucion]
      );

      return rows as StoreBeneficios[];
    }
    catch (error)
    {
      console.error("Error al obtener beneficios por solución:", error);
      throw new AppError("Error al obtener beneficios por solución", 500);
    }
  }

  async listSolucionAmbitoBeneficio():Promise<AsociarSolucionAmbitoBeneficioBody[]> 
  {
    const [rows]: [AsociarSolucionAmbitoBeneficioBody[], any] = await pool.promise().query(
      `SELECT id_solucion,id_ambito,id_beneficio FROM storeSolucionesAmbitosBeneficios`
    );
    return rows;
  }

  async listSolucionAmbitoSectorBeneficio():Promise<AsociarSolucionAmbitoSectorBeneficioBody[]> 
  {
    const [rows]: [AsociarSolucionAmbitoSectorBeneficioBody[], any] = await pool.promise().query(
      `SELECT id_solucion,id_ambito,id_sector,id_beneficio FROM storeSolucionesAmbitosSectoresBeneficios`
    );
    return rows;
  }

  /**
   * Actualiza un beneficio existente.
   * 
   * @param {number} id - El ID del beneficio a actualizar.
   * @param {Partial<StoreBeneficios>} updateData - Los datos a actualizar.
   * @returns {Promise<{ message: string }>} Mensaje confirmando que el beneficio fue actualizado.
   */
  async update(id: number, updateData: Partial<StoreBeneficios>): Promise<{ message: string }>
  {
    try
    {
      await pool.promise().query('UPDATE storeBeneficios SET ? WHERE id_beneficio = ?', [updateData, id]);
      return { message: 'Beneficio actualizado' };
    }
    catch (error)
    {
      console.error("Error al actualizar beneficio:", error);
      throw new AppError("Error al actualizar beneficio", 500);
    }
  }

  /**
   * Elimina un beneficio.
   * 
   * @param {number} idBeneficio - El ID del beneficio a eliminar.
   * @returns {Promise<boolean>} Indica si el beneficio fue eliminado exitosamente.
   * @throws {AppError} Si ocurre un error durante la transacción de eliminación.
   */
  async deleteBeneficio(idBeneficio: number): Promise<boolean>
  {
    const conn = await pool.promise().getConnection();
    try
    {
      await conn.beginTransaction();

      const [result]: any = await conn.query(
        'DELETE FROM storeSolucionesBeneficios WHERE id_beneficio = ?',
        [idBeneficio]
      );

      await conn.commit();

      return result.affectedRows > 0;
    }
    catch (error)
    {
      await conn.rollback();
      console.error('Error al eliminar la asociación del beneficio:', error);
      throw new AppError("Error al eliminar el beneficio", 500);
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Asocia un beneficio a una solución.
   * 
   * @param {number} idSolucion - El ID de la solución.
   * @param {number} idBeneficio - El ID del beneficio.
   * @returns {Promise<AsociarBeneficioResult>} Resultado de la operación con mensaje.
   * @throws {AppError} Si la solución o el beneficio no existen, o si ya existe una relación entre ambos.
   */
  async asociarBeneficio(idSolucion: number, idBeneficio: number): Promise<AsociarBeneficioResult> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const [solucionExiste]: [{ id_solucion: number }[]] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0) {
        throw new AppError(`La solución con id ${idSolucion} no existe.`, 404);
      }

      const [beneficioExiste]: [{ id_beneficio: number }[]] = await conn.query(
        `SELECT id_beneficio FROM storeBeneficios WHERE id_beneficio = ?`,
        [idBeneficio]
      );

      if (beneficioExiste.length === 0) {
        throw new AppError(`El beneficio con id ${idBeneficio} no existe.`, 404);
      }

      const [relacionExiste]: [{ id_solucion: number; id_beneficio: number }[]] = await conn.query(
        `SELECT id_solucion, id_beneficio FROM storeSolucionesBeneficios WHERE id_solucion = ? AND id_beneficio = ?`,
        [idSolucion, idBeneficio]
      );

      if (relacionExiste.length > 0) {
        await conn.commit();
        return { idSolucion, idBeneficio, message: 'La relación ya existía' };
      }

      await conn.query(
        `INSERT INTO storeSolucionesBeneficios (id_solucion, id_beneficio) VALUES (?, ?)`,
        [idSolucion, idBeneficio]
      );

      await conn.commit();

      return { idSolucion, idBeneficio, message: 'Relación creada con éxito' };
    } catch (error) {
      await conn.rollback();
      console.error("Error al asociar beneficio:", error);
      throw new AppError("Error al asociar beneficio", 500);
    } finally {
      conn.release();
    }
  }

  async asociarSolucionesAmbitosBeneficios(): Promise<void> {
    try {
      // 1. Obtener todas las combinaciones solución-ambito
      const [solucionesAmbitos] = await pool.promise().query(
        `SELECT id_solucion, id_ambito FROM storeSolucionesAmbitos`
      );

      for (const { id_solucion, id_ambito } of solucionesAmbitos as any[]) {
        // 2. Obtener todos los beneficios de esa solución
        const [beneficios] = await pool.promise().query(
          `SELECT id_beneficio FROM storeSolucionesBeneficios WHERE id_solucion = ?`,
          [id_solucion]
        );

        for (const { id_beneficio } of beneficios as any[]) {
          // 3. Verificar si ya existe la relación en storeSolucionesAmbitosBeneficios
          const [existente] = await pool.promise().query(
            `SELECT * FROM storeSolucionesAmbitosBeneficios WHERE id_solucion = ? AND id_ambito = ? AND id_beneficio = ?`,
            [id_solucion, id_ambito, id_beneficio]
          );

          if ((existente as any[]).length === 0) {
            // 4. Insertar la relación
            await pool.promise().query(
              `INSERT INTO storeSolucionesAmbitosBeneficios (id_solucion, id_ambito, id_beneficio) VALUES (?, ?, ?)`,
              [id_solucion, id_ambito, id_beneficio]
            );
          }
        }
      }
    } catch (error) {
      console.error('Error asociando todas las soluciones con ámbitos y beneficios:', error);
      throw error;
    }
  }

  async asociarTodasSolucionesAmbitosSectoresBeneficios(): Promise<void> {
    try {
      const [solAmbSec] = await pool.promise().query(
        `SELECT id_solucion, id_ambito, id_sector FROM storeSolucionesAmbitosSectores`
      );

      for (const { id_solucion, id_ambito, id_sector } of solAmbSec as any[]) {
        const [beneficios] = await pool.promise().query(
          `SELECT id_beneficio FROM storeSolucionesBeneficios WHERE id_solucion = ?`,
          [id_solucion]
        );

        for (const { id_beneficio } of beneficios as any[]) {
          await pool.promise().query(
            `INSERT IGNORE INTO storeSolucionesAmbitosSectoresBeneficios
            (id_solucion, id_ambito, id_sector, id_beneficio)
            VALUES (?, ?, ?, ?)`,
            [id_solucion, id_ambito, id_sector, id_beneficio]
          );
        }
      }
    } catch (error) {
      console.error('Error asociando soluciones-ambitos-sectores-beneficios:', error);
      throw new AppError('Error al asociar soluciones-ambitos-sectores-beneficios');
    }
  }


  /**
   * Selector de un beneficio una solución y un ámbito por sector.
   * 
   * @param {number} idSector - ID del sector.
   * @throws {AppError} Si ya existe la relación o si ocurre un error de base de datos.
   */
  async selectorSolucionAmbitoSectorBeneficio(idSector: number): Promise<any[]> 
  {
    try {
      const [rows] = await pool.promise().query(
        ` SELECT 
          a.description AS ambitoDescription, 
          b.description AS beneficioDescription
        FROM storeSolucionesAmbitosSectoresBeneficios sab
        JOIN storeAmbitos a ON sab.id_ambito = a.id_ambito
        JOIN storeBeneficios b ON sab.id_beneficio = b.id_beneficio
        WHERE sab.id_sector = ? `,
        [idSector]
      );
      return rows;
    } catch (error) {
      console.error('Error en el selector solución-ámbito-sector-beneficio:', error);
      throw new AppError('Error al asociar solución-ámbito-sector-beneficio');
    }
  }

}


export default new StoreBeneficiosServices();
