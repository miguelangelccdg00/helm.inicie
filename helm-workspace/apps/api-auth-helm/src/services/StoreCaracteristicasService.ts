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

interface AsociarSolucionAmbitoCaracteristicaBody 
{
  id_solucion: number;
  id_ambito: number;
  id_caracteristica: number;
}

interface AsociarSolucionAmbitoSectorCaracteristicaBody 
{
  id_solucion: number;
  id_ambito: number;
  id_sector: number;
  id_caracteristica: number;
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
   * Asocia un caracteristica a una solución, ámbito y sector.
   * 
   * @param {number} idSolucion - ID de la solución.
   * @param {number} idAmbito - ID del ámbito.
   * @param {number} idSector - ID del sector.
   * @param {number} idCaracteristica - ID del caracteristica.
   * @throws {AppError} Si la relación solución-ámbito-sector no existe o si ya existe la asociación.
   */
  async asociarSolucionAmbitoSectorCaracteristica(idSolucion: number,idAmbito: number,idSector: number,idCaracteristica: number): Promise<void> 
  {
    try 
    {
      // Verifica que exista la relación solucion-ambito-sector
      const [rows] = await pool.promise().query(
        `SELECT * FROM storeSolucionesAmbitosSectores
        WHERE id_solucion = ? AND id_ambito = ? AND id_sector = ?`,
        [idSolucion, idAmbito, idSector]
      );

      if ((rows as any[]).length === 0) 
      {
        throw new AppError('No existe la relación solución-ámbito-sector');
      }

      // Verifica si ya existe la relación antes de insertar
      const [existing] = await pool.promise().query(
        `SELECT * FROM storeSolucionesAmbitosSectoresCaracteristicas
        WHERE id_solucion = ? AND id_ambito = ? AND id_sector = ? AND id_caracteristica = ?`,
        [idSolucion, idAmbito, idSector, idCaracteristica]
      );

      if ((existing as any[]).length > 0) 
      {
        throw new AppError('La relación ya existe');
      }

      await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitosSectoresCaracteristicas 
        (id_solucion, id_ambito, id_sector, id_caracteristica)
        VALUES (?, ?, ?, ?)`,
        [idSolucion, idAmbito, idSector, idCaracteristica]
      );

    } 
    catch (error) 
    {
      console.error('Error al asociar solución-ámbito-sector-caracteristica:', error);
      throw new AppError('Error al asociar solución-ámbito-sector-caracteristica');
    }
  }

  /**
   * Asocia un caracteristica a una solución y un ámbito.
   * 
   * @param {number} idSolucion - ID de la solución.
   * @param {number} idAmbito - ID del ámbito.
   * @param {number} idCaracteristica - ID del caracteristica.
   * @throws {AppError} Si ya existe la relación o si ocurre un error de base de datos.
   */
  async asociarSolucionAmbitoCaracteristica(idSolucion: number, idAmbito: number, idCaracteristica: number): Promise<void> {
    try {
      // Verifica si ya existe la relación EN LA TABLA CORRECTA
      const [existing] = await pool.promise().query(
        `SELECT * FROM storeSolucionesAmbitosCaracteristicas
        WHERE id_solucion = ? AND id_ambito = ? AND id_caracteristica = ?`,
        [idSolucion, idAmbito, idCaracteristica]
      );

      if ((existing as any[]).length > 0) {
        throw new AppError('La relación solución-ámbito-característica ya existe');
      }

      await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitosCaracteristicas (id_solucion, id_ambito, id_caracteristica)
        VALUES (?, ?, ?)`,
        [idSolucion, idAmbito, idCaracteristica]
      );

    } catch (error) {
      console.error('Error al asociar solución-ámbito-característica:', error);
      throw new AppError('Error al asociar solución-ámbito-característica');
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

  async listSolucionAmbitoSectorCaracteristica():Promise<AsociarSolucionAmbitoSectorCaracteristicaBody[]> 
  {
    const [rows]: [AsociarSolucionAmbitoSectorCaracteristicaBody[], any] = await pool.promise().query(
      `SELECT id_solucion,id_ambito,id_sector,id_caracteristica FROM storeSolucionesAmbitosSectoresCaracteristicas`
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
