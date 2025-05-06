import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreCaracteristicas } from '../../../api-shared-helm/src/models/storeCaracteristicas.js';

interface CreateCaracteristicaInput {
  description: string;
  titulo: string;
  idSolucion: number;
}

interface AsociarCaracteristicaOutput {
  idSolucion: number;
  idCaracteristica: number;
  titulo?: string;
  message: string;
}

interface Caracteristica {
  id_caracteristica: number;
  description: string;
}

class StoreCaracteristicasService
{
  /**
   * Crea una característica y la asocia con una solución existente.
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

    try
    {
      await conn.beginTransaction();

      const [solucionExiste]: [any[], any] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
      }

      const [caracteristicaResult]: [any, any] = await conn.query(
        `INSERT INTO storeCaracteristicas (description) VALUES (?)`,
        [description]
      );

      const idCaracteristica: number = caracteristicaResult.insertId;

      await conn.query(
        `INSERT INTO storeSolucionesCaracteristicas (id_solucion, id_caracteristica) VALUES (?, ?)`,
        [idSolucion, idCaracteristica]
      );

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
      throw error;
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Asocia una característica existente con una solución existente.
   */
  async asociarCaracteristica(idSolucion: number, idCaracteristica: number, titulo?: string): Promise<AsociarCaracteristicaOutput>
  {
    const conn = await pool.promise().getConnection();

    try
    {
      await conn.beginTransaction();

      const [solucionExiste]: [any[], any] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0)
      {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
      }

      const [caracteristicaExiste]: [Caracteristica[], any] = await conn.query(
        `SELECT id_caracteristica, description FROM storeCaracteristicas WHERE id_caracteristica = ?`,
        [idCaracteristica]
      );

      if (caracteristicaExiste.length === 0)
      {
        throw new Error(`La característica con id ${idCaracteristica} no existe.`);
      }

      const [relacionExiste]: [any[], any] = await conn.query(
        `SELECT id_solucion, id_caracteristica FROM storeSolucionesCaracteristicas WHERE id_solucion = ? AND id_caracteristica = ?`,
        [idSolucion, idCaracteristica]
      );

      if (relacionExiste.length > 0)
      {
        await conn.commit();
        return { idSolucion, idCaracteristica, message: 'La relación ya existía' };
      }

      await conn.query(
        `INSERT INTO storeSolucionesCaracteristicas (id_solucion, id_caracteristica) VALUES (?, ?)`,
        [idSolucion, idCaracteristica]
      );

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
      throw error;
    }
    finally
    {
      conn.release();
    }
  }

  /**
   * Lista todas las características registradas.
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

  /**
   * Actualiza datos de una característica.
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
   * Elimina una característica, incluyendo su relación con soluciones.
   */
  async deleteCaracteristica(idCaracteristica: number): Promise<boolean>
  {
    const conn = await pool.promise().getConnection();
    try
    {
      await conn.beginTransaction();

      await conn.query(
        'DELETE FROM storeSolucionesCaracteristicas WHERE id_caracteristica = ?',
        [idCaracteristica]
      );

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
      throw error;
    }
    finally
    {
      conn.release();
    }
  }
}

export default new StoreCaracteristicasService();

