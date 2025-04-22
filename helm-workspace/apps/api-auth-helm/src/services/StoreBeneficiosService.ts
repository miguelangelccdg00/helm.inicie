import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreBeneficios } from '../../../api-shared-helm/src/models/storeBeneficios.js';

interface CreateBeneficioDTO {
  description: string;
  idSolucion: number;
}

interface AsociarBeneficioResult {
  idSolucion: number;
  idBeneficio: number;
  message: string;
}

class StoreBeneficiosServices {
  async createBeneficio({ description, idSolucion }: CreateBeneficioDTO): Promise<{ idBeneficio: number; idSolucion: number }> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const [solucionExiste]: [{ id_solucion: number }[]] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0) {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
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
    } catch (error) {
      await conn.rollback();
      console.error("Error al insertar beneficio:", error);
      throw error;
    } finally {
      conn.release();
    }
  }

  async getBeneficio(): Promise<StoreBeneficios[]> {
    const [rows] = await pool.promise().query(`SELECT id_beneficio, description FROM storeBeneficios`);
    return rows as StoreBeneficios[];
  }

  async getByIdBeneficio(idSolucion: number): Promise<StoreBeneficios[]> {
    const [rows] = await pool.promise().query(
      `SELECT b.id_beneficio, b.description
      FROM storeBeneficios b
      JOIN storeSolucionesBeneficios sb ON b.id_beneficio = sb.id_beneficio
      WHERE sb.id_solucion = ?`,
      [idSolucion]
    );

    return rows as StoreBeneficios[];
  }

  async update(id: number, updateData: Partial<StoreBeneficios>): Promise<{ message: string }> {
    await pool.promise().query('UPDATE storeBeneficios SET ? WHERE id_beneficio = ?', [updateData, id]);
    return { message: 'Beneficio actualizado' };
  }

  async deleteBeneficio(idBeneficio: number): Promise<boolean> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const [result]: any = await conn.query(
        'DELETE FROM storeSolucionesBeneficios WHERE id_beneficio = ?',
        [idBeneficio]
      );

      await conn.commit();

      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      console.error('Error al eliminar la asociación del beneficio:', error);
      throw error;
    } finally {
      conn.release();
    }
  }

  async asociarBeneficio(idSolucion: number, idBeneficio: number): Promise<AsociarBeneficioResult> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const [solucionExiste]: [{ id_solucion: number }[]] = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0) {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
      }

      const [beneficioExiste]: [{ id_beneficio: number }[]] = await conn.query(
        `SELECT id_beneficio FROM storeBeneficios WHERE id_beneficio = ?`,
        [idBeneficio]
      );

      if (beneficioExiste.length === 0) {
        throw new Error(`El beneficio con id ${idBeneficio} no existe.`);
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
      throw error;
    } finally {
      conn.release();
    }
  }
}

export default new StoreBeneficiosServices();
