import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreProblemas } from '../../../api-shared-helm/src/models/storeProblemas';
import { AppError } from '../../../api-shared-helm/src/models/AppError';

interface CreateProblemaInput
{
  description: string;
  idSolucion: number;
  titulo?: string;
}

interface AsociarSolucionAmbitoProblemaBody 
{
  id_solucion: number;
  id_ambito: number;
  id_problema: number;
}

class StoreProblemasService
{
  /**
   * Crea un nuevo problema y lo asocia a una solución existente.
   * 
   * @param {CreateProblemaInput} input - Datos necesarios para crear el problema.
   * @param {string} input.description - Descripción del problema.
   * @param {number} input.idSolucion - ID de la solución con la que se desea asociar el problema.
   * @param {string} [input.titulo] - Título opcional del problema.
   * 
   * @returns {Promise<object>} Retorna un objeto con el ID del problema creado y sus datos asociados.
   * 
   * @throws {Error} Si la solución no existe o ocurre un error en la base de datos.
   */
  async createProblema({ description, idSolucion, titulo }: CreateProblemaInput)
  {
    const conn = await pool.promise().getConnection();

    try
    {
      await conn.beginTransaction();

      const [solucionExiste]: any = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
      }

      const [problemaResult]: any = await conn.query(
        `INSERT INTO storeProblemas (description) VALUES (?)`,
        [description]
      );

      const idProblema = problemaResult.insertId;

      await conn.query(
        `INSERT INTO storeSolucionesProblemas (id_solucion, id_problema) VALUES (?, ?)`,
        [idSolucion, idProblema]
      );

      await conn.query(
        `UPDATE storeSoluciones SET problemaTitle = ?, problemaPragma = ? WHERE id_solucion = ?`,
        [titulo || 'Problema sin título', description, idSolucion]
      );

      await conn.commit();

      return { idProblema, idSolucion, description, titulo };
    }
    catch (error)
    {
      await conn.rollback();
      console.error('Error al insertar el problema:', error);
      throw error;
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Obtiene todos los problemas registrados.
   * 
   * @returns {Promise<StoreProblemas[]>} Lista de todos los problemas existentes.
   */
  async getProblemas()
  {
    const [rows] = await pool.promise().query(
      `SELECT id_problema, description FROM storeProblemas`
    );
    return rows as StoreProblemas[];
  }

  /**
   * Obtiene un problema por su ID.
   * 
   * @param {number} idProblema - ID del problema a buscar.
   * 
   * @returns {Promise<StoreProblemas | null>} El problema encontrado o `null` si no existe.
   */
  async getProblemaById(idProblema: number)
  {
    const [rows] = await pool.promise().query(
      `SELECT id_problema, description FROM storeProblemas WHERE id_problema = ?`,
      [idProblema]
    );
    return rows.length ? (rows[0] as StoreProblemas) : null;
  }

  /**
   * Obtiene todos los problemas asociados a una solución específica.
   * 
   * @param {number} idSolucion - ID de la solución.
   * 
   * @returns {Promise<StoreProblemas[]>} Lista de problemas asociados a esa solución.
   */
  async getByIdProblemas(idSolucion: number)
  {
    const [rows] = await pool.promise().query(
      `SELECT p.id_problema, p.description
       FROM storeProblemas p
       JOIN storeSolucionesProblemas sp ON p.id_problema = sp.id_problema
       WHERE sp.id_solucion = ?`,
      [idSolucion]
    );
    return rows as StoreProblemas[];
  }

  async listSolucionAmbitoProblema():Promise<AsociarSolucionAmbitoProblemaBody[]> 
  {
    const [rows]: [AsociarSolucionAmbitoProblemaBody[], any] = await pool.promise().query(
      `SELECT id_solucion,id_ambito,id_problema FROM storeSolucionesAmbitosProblemas`
    );
    return rows;
  }

  /**
   * Asocia un problema existente a una solución.
   * 
   * @param {number} idSolucion - ID de la solución.
   * @param {number} idProblema - ID del problema.
   * @param {string} [titulo] - Título opcional que se asignará a la relación.
   * 
   * @returns {Promise<object>} Resultado de la operación, incluyendo mensaje si ya existía la relación.
   * 
   * @throws {Error} Si el problema o solución no existen o hay error en la base de datos.
   */
  async asociarProblema(idSolucion: number, idProblema: number, titulo?: string)
  {
    const conn = await pool.promise().getConnection();

    try
    {
      await conn.beginTransaction();

      const [solucionExiste]: any = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
      }

      const [problemaExiste]: any = await conn.query(
        `SELECT id_problema, description FROM storeProblemas WHERE id_problema = ?`,
        [idProblema]
      );

      if (problemaExiste.length === 0)
      {
        throw new Error(`El problema con id ${idProblema} no existe.`);
      }

      const [relacionExiste]: any = await conn.query(
        `SELECT id_solucion, id_problema FROM storeSolucionesProblemas WHERE id_solucion = ? AND id_problema = ?`,
        [idSolucion, idProblema]
      );

      if (relacionExiste.length > 0)
      {
        await conn.commit();
        return { idSolucion, idProblema, message: 'La relación ya existía' };
      }

      await conn.query(
        `INSERT INTO storeSolucionesProblemas (id_solucion, id_problema) VALUES (?, ?)`,
        [idSolucion, idProblema]
      );

      const problema = problemaExiste[0];

      await conn.query(
        `UPDATE storeSoluciones SET problemaTitle = ?, problemaPragma = ? WHERE id_solucion = ?`,
        [titulo || 'Problema sin título', problema.description, idSolucion]
      );

      await conn.commit();

      return { idSolucion, idProblema, titulo, message: 'Relación creada con éxito' };
    }
    catch (error)
    {
      await conn.rollback();
      console.error('Error al asociar problema:', error);
      throw error;
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
   * @param {number} idProblema - ID del problema.
   */
  async asociarSolucionAmbitoProblema(idSolucion: number, idAmbito: number, idProblema: number): Promise<void> 
  {
    try 
    {
      const [solucionAmbitoExists] = await pool.promise().query(
        `SELECT sa.id_solucion, sa.id_ambito FROM storeSolucionesAmbitos sa WHERE id_solucion = ?, id_ambito = ?`,
        [idSolucion, idAmbito]);

      const [problemaExists] = await pool.promise().query(
        `SELECT b.id_problema FROM storeProblemas b WHERE b.id_problema = ?`,
        [idProblema]
      );

      if (solucionAmbitoExists.affectedRows === 0) 
      {
        throw new AppError('Solucion o ambito no existe');
      }

      if (problemaExists.affectedRows === 0) 
      {
        throw new AppError('Problema no existe');
      }

      const [result] = await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitosProblemas (id_solucion, id_ambito, id_problema) VALUES (?, ?, ?)`,
        [idSolucion, idAmbito, idProblema]
      );

    } 
    catch (error) 
    {
      console.error('Error al asociar el storeSolucionesAmbitosProblemas:', error);
      throw new AppError('Error al asociar el storeSolucionesAmbitosProblemas');
    }
  }

  /**
   * Actualiza un problema existente.
   * 
   * @param {number} id - ID del problema que se desea actualizar.
   * @param {Partial<StoreProblemas>} updateData - Datos que se desean modificar.
   * 
   * @returns {Promise<object>} Mensaje de confirmación.
   */
  async update(id: number, updateData: Partial<StoreProblemas>)
  {
    await pool.promise().query(
      'UPDATE storeProblemas SET ? WHERE id_problema = ?',
      [updateData, id]
    );
    return { message: 'Problema actualizado' };
  }

  /**
   * Elimina un problema y su asociación con soluciones.
   * 
   * @param {number} idProblema - ID del problema a eliminar.
   * 
   * @returns {Promise<boolean>} Retorna `true` si la eliminación fue exitosa.
   * 
   * @throws {Error} En caso de fallo durante la eliminación.
   */
  async deleteProblema(idProblema: number): Promise<boolean>
  {
    const conn = await pool.promise().getConnection();

    try
    {
      await conn.beginTransaction();

      const [result]: any = await conn.query(
        'DELETE FROM storeSolucionesProblemas WHERE id_problema = ?',
        [idProblema]
      );

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
