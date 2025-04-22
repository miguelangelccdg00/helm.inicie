import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreProblemas } from '../../../api-shared-helm/src/models/storeProblemas';

interface CreateProblemaInput {
  description: string;
  idSolucion: number;
  titulo?: string;
}

class StoreProblemasService {
  
  async createProblema({ description, idSolucion, titulo }: CreateProblemaInput) {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();
      
      const [solucionExiste]: any = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0) {
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
    } catch (error) {
      await conn.rollback();
      console.error('Error al insertar el problema:', error);
      throw error;
    } finally {
      conn.release();
    }
  }

  async getProblemas() {
    const [rows] = await pool.promise().query(`SELECT id_problema, description FROM storeProblemas`);
    return rows as StoreProblemas[];
  }

  async getProblemaById(idProblema: number) {
    const [rows] = await pool.promise().query(
      `SELECT id_problema, description FROM storeProblemas WHERE id_problema = ?`,
      [idProblema]
    );
    return rows.length ? (rows[0] as StoreProblemas) : null;
  }

  async getByIdProblemas(idSolucion: number) {
    const [rows] = await pool.promise().query(
      `SELECT p.id_problema, p.description
       FROM storeProblemas p
       JOIN storeSolucionesProblemas sp ON p.id_problema = sp.id_problema
       WHERE sp.id_solucion = ?`,
      [idSolucion]
    );
    return rows as StoreProblemas[];
  }

  async asociarProblema(idSolucion: number, idProblema: number, titulo?: string) {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      const [solucionExiste]: any = await conn.query(
        `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`,
        [idSolucion]
      );

      if (solucionExiste.length === 0) {
        throw new Error(`La solución con id ${idSolucion} no existe.`);
      }

      const [problemaExiste]: any = await conn.query(
        `SELECT id_problema, description FROM storeProblemas WHERE id_problema = ?`,
        [idProblema]
      );

      if (problemaExiste.length === 0) {
        throw new Error(`El problema con id ${idProblema} no existe.`);
      }

      const [relacionExiste]: any = await conn.query(
        `SELECT id_solucion, id_problema FROM storeSolucionesProblemas WHERE id_solucion = ? AND id_problema = ?`,
        [idSolucion, idProblema]
      );

      if (relacionExiste.length > 0) {
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
    } catch (error) {
      await conn.rollback();
      console.error('Error al asociar problema:', error);
      throw error;
    } finally {
      conn.release();
    }
  }

  async update(id: number, updateData: Partial<StoreProblemas>) {
    await pool.promise().query('UPDATE storeProblemas SET ? WHERE id_problema = ?', [updateData, id]);
    return { message: 'Problema actualizado' };
  }

  async deleteProblema(idProblema: number): Promise<boolean> {
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();
      const [result]: any = await conn.query('DELETE FROM storeSolucionesProblemas WHERE id_problema = ?', [idProblema]);
      await conn.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await conn.rollback();
      console.error('Error al eliminar la asociación del problema:', error);
      throw error;
    } finally {
      conn.release();
    }
  }
}

export default new StoreProblemasService();
