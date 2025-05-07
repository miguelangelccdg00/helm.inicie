import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreAmbitos } from '../../../api-shared-helm/src/models/storeAmbitos';
import { SolucionAmbito } from '../../../api-shared-helm/src/models/solucionAmbito';

interface CreateAmbitoParams {
  description: string;
  textoweb: string;
  prefijo: string;
  slug: string;
}

interface AmbitosParams {
  description: string;
  textoweb: string;
  prefijo: string;
  slug: string;
}

interface AsociarAmbitoParams {
  id_solucion: number;
  id_ambito: number;
}

class StoreAmbitosService {
  /**
   * Crea un nuevo ámbito y lo asocia con todas las soluciones existentes y sectores.
   * @param {CreateAmbitoParams} param0 - Datos del nuevo ámbito.
   * @returns {Promise<StoreAmbitos>} El ámbito creado.
   */
  async createAmbito({ description, textoweb, prefijo, slug }: Omit<CreateAmbitoParams, 'idSoluciones'>): Promise<StoreAmbitos> {
    try {
      const [result]: any = await pool.promise().query(
        `INSERT INTO storeAmbitos (description, textoweb, prefijo, slug) VALUES (?, ?, ?, ?)`,
        [description, textoweb, prefijo, slug]
      );

      const idAmbito = result.insertId;

      await pool.promise().query(`
        INSERT INTO storeSolucionesAmbitos (id_solucion, id_ambito)
        SELECT s.id_solucion, ? FROM storeSoluciones s
        WHERE NOT EXISTS (
          SELECT 1 FROM storeSolucionesAmbitos sa WHERE sa.id_solucion = s.id_solucion AND sa.id_ambito = ?
        )`, [idAmbito, idAmbito]);

      await pool.promise().query(`
        INSERT INTO storeSolucionesAmbitosSectores (id_solucion, id_ambito, id_sector)
        SELECT s.id_solucion, ?, sec.id_sector
        FROM storeSoluciones s
        CROSS JOIN storeSectores sec
        WHERE NOT EXISTS (
          SELECT 1 FROM storeSolucionesAmbitosSectores sas
          WHERE sas.id_solucion = s.id_solucion AND sas.id_ambito = ? AND sas.id_sector = sec.id_sector
        )`, [idAmbito, idAmbito]);

      return { id_ambito: idAmbito, description, textoweb, prefijo, slug };
    } catch (error) {
      console.error('Error al crear el ámbito y asociarlo:', error);
      throw new Error('Error al crear el ámbito y hacer las asociaciones');
    }
  }

  /**
   * Crea un nuevo ámbito sin asociaciones automáticas.
   * @param {AmbitosParams} param0 - Datos del ámbito.
   * @returns {Promise<StoreAmbitos>} Ámbito creado.
   */
  async createStoreAmbito({ description, textoweb, prefijo, slug }: AmbitosParams): Promise<StoreAmbitos> {
    try {
      const [result]: any = await pool.promise().query(
        `INSERT INTO storeAmbitos (description, textoweb, prefijo, slug) VALUES (?, ?, ?, ?)`,
        [description, textoweb, prefijo, slug]
      );
      return { id_ambito: result.insertId, description, textoweb, prefijo, slug };
    } catch (error) {
      console.error('Error al crear el ámbito:', error);
      throw new Error('Error al crear el ámbito');
    }
  }

  /**
   * Asocia un ámbito a una solución.
   * @param {number} idSolucion - ID de la solución.
   * @param {number} idAmbito - ID del ámbito.
   */
  async asociarAmbito(idSolucion: number, idAmbito: number): Promise<void> {
    try {
      const [result] = await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitos (id_solucion, id_ambito) VALUES (?, ?)`,
        [idSolucion, idAmbito]
      );
      if (result.affectedRows === 0) {
        throw new Error('No se pudo asociar el ámbito');
      }
    } catch (error) {
      console.error('Error al asociar el ámbito:', error);
      throw new Error('Error al asociar el ámbito');
    }
  }

  /**
   * Lista todos los ámbitos.
   * @returns {Promise<StoreAmbitos[]>} Lista de ámbitos.
   */
  async listAmbitos(): Promise<StoreAmbitos[]> {
    try {
      const [rows] = await pool.promise().query(
        `SELECT id_ambito, description, textoweb, prefijo, slug FROM storeAmbitos`
      );
      return rows;
    } catch (error) {
      console.error('Error al listar los ámbitos:', error);
      throw new Error('Error al listar los ámbitos');
    }
  }

  /**
   * Obtiene un ámbito por su ID.
   * @param {number} idAmbito - ID del ámbito.
   * @returns {Promise<StoreAmbitos | null>} Ámbito encontrado o null.
   */
  async getAmbitoById(idAmbito: number): Promise<StoreAmbitos | null> {
    try {
      const [rows] = await pool.promise().query(
        `SELECT id_ambito, description, textoweb, prefijo, slug FROM storeAmbitos WHERE id_ambito = ?`,
        [idAmbito]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error al obtener el ámbito por ID:', error);
      throw new Error('Error al obtener el ámbito');
    }
  }

  /**
   * Obtiene los ámbitos asociados a una solución.
   * @param {number} idSolucion - ID de la solución.
   * @returns {Promise<StoreAmbitos[]>} Lista de ámbitos.
   */
  async getByIdAmbitos(idSolucion: number): Promise<StoreAmbitos[]> {
    try {
      const [rows] = await pool.promise().query(
        `SELECT a.id_ambito, a.description, a.textoweb, a.prefijo, a.slug
         FROM storeAmbitos a
         JOIN storeSolucionesAmbitos sa ON a.id_ambito = sa.id_ambito
         WHERE sa.id_solucion = ?`,
        [idSolucion]
      );
      return rows;
    } catch (error) {
      console.error('Error al obtener los ámbitos por ID de solución:', error);
      throw new Error('Error al obtener los ámbitos');
    }
  }

  /**
   * Actualiza un ámbito existente.
   * @param {number} idAmbito - ID del ámbito.
   * @param {number} idSolucion - ID de la solución (no usado).
   * @param {Partial<StoreAmbitos & SolucionAmbito>} updateData - Datos a actualizar.
   * @returns {Promise<StoreAmbitos>} Ámbito actualizado.
   */
  async update(idAmbito: number, idSolucion: number, updateData: Partial<StoreAmbitos & SolucionAmbito>): Promise<StoreAmbitos> {
    return this.updateAmbito(idAmbito, updateData);
  }

  /**
   * Actualiza los campos de un ámbito.
   * @param {number} idAmbito - ID del ámbito.
   * @param {Partial<StoreAmbitos & SolucionAmbito>} updateData - Campos a actualizar.
   * @returns {Promise<StoreAmbitos>} Ámbito actualizado.
   */
  async updateAmbito(idAmbito: number, updateData: Partial<StoreAmbitos & SolucionAmbito>): Promise<StoreAmbitos> {
    try {
      const { description, textoweb, prefijo, slug } = updateData;
      const updateFields = [];
      const updateValues = [];

      if (description) updateFields.push('description = ?'), updateValues.push(description);
      if (textoweb) updateFields.push('textoweb = ?'), updateValues.push(textoweb);
      if (prefijo) updateFields.push('prefijo = ?'), updateValues.push(prefijo);
      if (slug) updateFields.push('slug = ?'), updateValues.push(slug);

      updateValues.push(idAmbito);

      const [result] = await pool.promise().query(
        `UPDATE storeAmbitos SET ${updateFields.join(', ')} WHERE id_ambito = ?`,
        updateValues
      );

      if (result.affectedRows === 0) {
        throw new Error('No se encontró el ámbito para actualizar');
      }

      return { id_ambito: idAmbito, description: description || '', textoweb: textoweb || '', prefijo: prefijo || '', slug: slug || '' };
    } catch (error) {
      console.error('Error al actualizar el ámbito:', error);
      throw new Error('Error al actualizar el ámbito');
    }
  }

  /**
   * Actualiza una relación existente entre solución y ámbito.
   * @param {number} idSolucion - ID de la solución.
   * @param {SolucionAmbito} solucionAmbito - Datos para actualizar.
   * @returns {Promise<SolucionAmbito>} Relación actualizada.
   */
  async updateSolucionAmbitos(idSolucion: number, solucionAmbito: SolucionAmbito): Promise<SolucionAmbito> {
    try {
      const { id_ambito } = solucionAmbito;
      if (!idSolucion || !id_ambito) throw new Error('Faltan id_solucion o id_ambito');

      const [rows] = await pool.promise().query(
        `SELECT * FROM storeSolucionesAmbitos WHERE id_solucion = ? AND id_ambito = ?`,
        [idSolucion, id_ambito]
      ) as any[];

      if (!rows.length) throw new Error('No existe la relación ambito-solución para actualizar');

      await pool.promise().query(
        `UPDATE storeSolucionesAmbitos SET ... WHERE id_solucion = ? AND id_ambito = ?`,
        [...Array(22).fill(''), idSolucion, id_ambito] // Aquí deberías reemplazar con los valores correctos
      );

      return { ...solucionAmbito };
    } catch (error) {
      console.error('Error al actualizar la relación ambito-solución:', error);
      throw new Error('Error al actualizar la relación ambito-solución');
    }
  }

  /**
   * Elimina un ámbito.
   * @param {number} idAmbito - ID del ámbito a eliminar.
   * @returns {Promise<boolean>} True si fue eliminado.
   */
  async deleteAmbito(idAmbito: number): Promise<boolean> {
    try {
      const [result] = await pool.promise().query(
        `DELETE FROM storeAmbitos WHERE id_ambito = ?`,
        [idAmbito]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar el ámbito:', error);
      throw new Error('Error al eliminar el ámbito');
    }
  }

  /**
   * Elimina la relación entre un ámbito y una solución.
   * @param {number} idSolucion - ID de la solución.
   * @param {number} idAmbito - ID del ámbito.
   * @returns {Promise<boolean>} True si fue eliminado.
   */
  async deleteAmbitoSolucion(idSolucion: number, idAmbito: number): Promise<boolean> {
    try {
      const [result] = await pool.promise().query(
        `DELETE FROM storeSolucionesAmbitos WHERE id_solucion = ? AND id_ambito = ?`,
        [idSolucion, idAmbito]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar la relación de ámbito-solución:', error);
      throw new Error('Error al eliminar la relación');
    }
  }
}

export default new StoreAmbitosService();
