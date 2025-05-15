import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreCaracteristicas } from '../../../api-shared-helm/src/models/storeCaracteristicas.js';
import { AppError } from '../../../api-shared-helm/src/models/AppError';

/**
 * Interfaz para los parámetros de entrada para la creación de una nueva característica.
 * @interface CreateCaracteristicaInput
 */
interface CreateCaracteristicaInput
{
  description: string;
  titulo: string;
  idSolucion: number;
}

/**
 * Interfaz para el resultado de asociar una característica a una solución.
 * @interface AsociarCaracteristicaOutput
 */
interface AsociarCaracteristicaOutput
{
  idSolucion: number;
  idCaracteristica: number;
  titulo?: string;
  message: string;
}

/**
 * Interfaz para representar una característica.
 * @interface Caracteristica
 */
interface Caracteristica
{
  id_caracteristica: number;
  description: string;
}

interface AsociarSolucionAmbitoCaracteristicaBody 
{
  id_solucion: number;
  id_ambito: number;
  id_caracteristica: number;
}

/**
 * Servicio para gestionar las características asociadas a las soluciones.
 * @class StoreCaracteristicasService
 */
class StoreCaracteristicasService
{
  /**
   * Crea una nueva característica y la asocia a una solución existente.
   * @param {CreateCaracteristicaInput} params - Parámetros necesarios para crear la característica.
   * @returns {Promise<{ idCaracteristica: number; idSolucion: number; description: string; titulo: string; caracteristicasTitle: string; caracteristicasPragma: string }>} - Información de la característica creada y la solución asociada.
   * @throws {AppError} Si la solución no existe o si ocurre un error durante la transacción.
   */
  async createCaracteristica({ description, titulo, idSolucion }: CreateCaracteristicaInput): Promise<{
    idCaracteristica: number;
    idSolucion: number;
    description: string;
    titulo: string;
    caracteristicasTitle: string;
    caracteristicasPragma: string;
  }>
  {
    const conn = await pool.promise().getConnection();

    try {
      await conn.beginTransaction();

      // Verificar que la solución existe
      const [solucionExiste]: [any[], any] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new AppError(`La solución con id ${idSolucion} no existe.`, 404);
      }

      // Crear la nueva característica
      const [caracteristicaResult]: [any, any] = await conn.query(
        `INSERT INTO storeCaracteristicas (description) VALUES (?)`,
        [description]
      );

      const idCaracteristica: number = caracteristicaResult.insertId;

      // Asociar la característica con la solución
      await conn.query(
        `INSERT INTO storeSolucionesCaracteristicas (id_solucion, id_caracteristica) VALUES (?, ?)`,
        [idSolucion, idCaracteristica]
      );

      // Actualizar los campos adicionales de la solución
      await conn.query(
        `UPDATE storeSoluciones SET caracteristicasTitle = ?, caracteristicasPragma = ? WHERE id_solucion = ?`,
        [titulo, description, idSolucion]
      );

      await conn.commit();

      return {
        idCaracteristica,
        idSolucion,
        description,
        titulo,
        caracteristicasTitle: titulo,
        caracteristicasPragma: description
      };
    }
    catch (error)
    {
      await conn.rollback();
      console.error("Error al insertar la característica:", error);
      throw error instanceof AppError ? error : new AppError("Error al crear la característica", 500);
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Asocia una característica existente con una solución existente.
   * @param {number} idSolucion - El ID de la solución.
   * @param {number} idCaracteristica - El ID de la característica.
   * @param {string} [titulo] - El título opcional de la característica.
   * @returns {Promise<AsociarCaracteristicaOutput>} Resultado de la operación con mensaje.
   * @throws {AppError} Si la solución o la característica no existen, o si ya existe una relación entre ambos.
   */
  async asociarCaracteristica(idSolucion: number, idCaracteristica: number, titulo?: string): Promise<AsociarCaracteristicaOutput>
  {
    const conn = await pool.promise().getConnection();

    try {
      await conn.beginTransaction();

      // Verificar que la solución existe
      const [solucionExiste]: [any[], any] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new AppError(`La solución con id ${idSolucion} no existe.`, 404);
      }

      // Verificar que la característica existe
      const [caracteristicaExiste]: [Caracteristica[], any] = await conn.query(
        `SELECT id_caracteristica, description FROM storeCaracteristicas WHERE id_caracteristica = ?`,
        [idCaracteristica]
      );

      if (caracteristicaExiste.length === 0)
      {
        throw new AppError(`La característica con id ${idCaracteristica} no existe.`, 404);
      }

      // Verificar si ya existe la relación entre solución y característica
      const [relacionExiste]: [any[], any] = await conn.query(
        `SELECT id_solucion, id_caracteristica FROM storeSolucionesCaracteristicas WHERE id_solucion = ? AND id_caracteristica = ?`,
        [idSolucion, idCaracteristica]
      );

      if (relacionExiste.length > 0)
      {
        await conn.commit();
        return { idSolucion, idCaracteristica, message: 'La relación ya existía' };
      }

      // Crear la relación entre la solución y la característica
      await conn.query(
        `INSERT INTO storeSolucionesCaracteristicas (id_solucion, id_caracteristica) VALUES (?, ?)`,
        [idSolucion, idCaracteristica]
      );

      // Actualizar los campos de la solución
      const caracteristica = caracteristicaExiste[0];
      await conn.query(
        `UPDATE storeSoluciones SET caracteristicasTitle = ?, caracteristicasPragma = ? WHERE id_solucion = ?`,
        [titulo || "característica sin título", caracteristica.description, idSolucion]
      );

      await conn.commit();

      return { idSolucion, idCaracteristica, titulo, message: 'Relación creada con éxito' };
    }
    catch (error)
    {
      await conn.rollback();
      console.error("Error al asociar característica:", error);
      throw error instanceof AppError ? error : new AppError("Error al asociar la característica", 500);
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Asocia un ámbito a una solución.
   * @param {number} idSolucion - ID de la solución.
   * @param {number} idAmbito - ID del ámbito.
   * @param {number} idCaracteristica - ID del caracteristica.
   */
  async asociarSolucionAmbitoCaracteristica(idSolucion: number, idAmbito: number, idCaracteristica: number): Promise<void> 
  {
    try 
    {
      const [solucionAmbitoExists] = await pool.promise().query(
        `SELECT sa.id_solucion, sa.id_ambito FROM storeSolucionesAmbitos sa WHERE id_solucion = ?, id_ambito = ?`,
        [idSolucion, idAmbito]);

      const [caracteristicaExists] = await pool.promise().query(
        `SELECT c.id_caracteristica FROM storeCaracteristicas c WHERE id_caracteristica = ?`,
        [idCaracteristica]
      );

      if (solucionAmbitoExists.affectedRows === 0) 
      {
        throw new AppError('Solucion o ambito no existe');
      }

      if (caracteristicaExists.affectedRows === 0) 
      {
        throw new AppError('Caracteristica no existe');
      }

      const [result] = await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitosCaracteristicas (id_solucion, id_ambito, id_caracteristica) VALUES (?, ?, ?)`,
        [idSolucion, idAmbito, idCaracteristica]
      );

    } 
    catch (error) 
    {
      console.error('Error al asociar el solucionAmbitoCaracteristica:', error);
      throw new AppError('Error al asociar el solucionAmbitoCaracteristica');
    }
  }

  /**
   * Lista todas las características registradas.
   * @returns {Promise<Caracteristica[]>} Lista de todas las características registradas.
   */
  async listCaracteristicas(): Promise<Caracteristica[]>
  {
    const [rows]: [Caracteristica[], any] = await pool.promise().query(
      `SELECT id_caracteristica, description FROM storeCaracteristicas`
    );
    return rows;
  }

  /**
   * Obtiene una característica específica por su ID.
   * @param {number} idCaracteristica - El ID de la característica a obtener.
   * @returns {Promise<Caracteristica | null>} La característica encontrada, o null si no existe.
   */
  async getCaracteristicaById(idCaracteristica: number): Promise<Caracteristica | null>
  {
    const [rows]: [Caracteristica[], any] = await pool.promise().query(
      `SELECT id_caracteristica, description FROM storeCaracteristicas WHERE id_caracteristica = ?`,
      [idCaracteristica]
    );
    return rows.length ? rows[0] : null;
  }

  /**
   * Obtiene las características asociadas a una solución específica.
   * @param {number} idSolucion - El ID de la solución a obtener las características.
   * @returns {Promise<Caracteristica[]>} Lista de características asociadas a la solución.
   */
  async getByIdCaracteristicas(idSolucion: number): Promise<Caracteristica[]>
  {
    const [rows]: [Caracteristica[], any] = await pool.promise().query(
      `SELECT c.id_caracteristica, c.description
       FROM storeCaracteristicas c
       JOIN storeSolucionesCaracteristicas sc ON c.id_caracteristica = sc.id_caracteristica
       WHERE sc.id_solucion = ?`,
      [idSolucion]
    );
    return rows;
  }

  async listSolucionAmbitoCaracteristica():Promise<AsociarSolucionAmbitoCaracteristicaBody[]> 
  {
    const [rows]: [AsociarSolucionAmbitoCaracteristicaBody[], any] = await pool.promise().query(
      `SELECT id_solucion,id_ambito,id_caracteristica FROM storeSolucionesAmbitosCaracteristicas`
    );
    return rows;
  }

  /**
   * Actualiza los datos de una característica.
   * @param {number} id - El ID de la característica a actualizar.
   * @param {Partial<StoreCaracteristicas>} updateData - Los datos a actualizar.
   * @returns {Promise<{ message: string }>} Mensaje confirmando la actualización de la característica.
   */
  async update(id: number, updateData: Partial<StoreCaracteristicas>): Promise<{ message: string }>
  {
    await pool.promise().query(
      'UPDATE storeCaracteristicas SET ? WHERE id_caracteristica = ?',
      [updateData, id]
    );
    return { message: 'Característica actualizada' };
  }

  /**
   * Elimina una característica y su relación con soluciones.
   * @param {number} idCaracteristica - El ID de la característica a eliminar.
   * @returns {Promise<boolean>} Indica si la característica fue eliminada exitosamente.
   * @throws {AppError} Si ocurre un error durante la eliminación.
   */
  async deleteCaracteristica(idCaracteristica: number): Promise<boolean>
  {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      // Eliminar la relación de la característica con las soluciones
      await conn.query(
        'DELETE FROM storeSolucionesCaracteristicas WHERE id_caracteristica = ?',
        [idCaracteristica]
      );

      // Eliminar la característica
      const [caracteristicaResult]: [any, any] = await conn.query(
        'DELETE FROM storeCaracteristicas WHERE id_caracteristica = ?',
        [idCaracteristica]
      );

      await conn.commit();

      return caracteristicaResult.affectedRows > 0;
    }
    catch (error)
    {
      await conn.rollback();
      console.error('Error al eliminar la característica:', error);
      throw error instanceof AppError ? error : new AppError("Error al eliminar la característica", 500);
    }
    finally
    {
      conn.release();
    }
  }
}

export default new StoreCaracteristicasService();
