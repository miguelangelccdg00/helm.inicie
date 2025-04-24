import { pool } from '../../../api-shared-helm/src/databases/conexion'; // Ajusta la ruta según corresponda
import { StoreAmbitos } from '../../../api-shared-helm/src/models/storeAmbitos';
import { SolucionAmbito } from '../../../api-shared-helm/src/models/solucionAmbito';

interface CreateAmbitoParams {
  description: string;
  textoweb: string;
  prefijo: string;
  slug: string;
  idSolucion: number;
}

interface AsociarAmbitoParams {
  id_solucion: number;
  id_ambito: number;
}

class StoreAmbitosService {
  
  // Crear un nuevo ámbito
  async createAmbito({description,textoweb,prefijo,slug,idSolucion }: CreateAmbitoParams): Promise<StoreAmbitos> {
    try {
      const [result] = await pool.promise().query(
        `INSERT INTO storeAmbitos (description, textoweb, prefijo, slug)
         VALUES (?, ?, ?, ?)`,
        [description, textoweb, prefijo, slug]
      );
      const idAmbito = result.insertId;

      // Asociamos el nuevo ámbito con la solución proporcionada
      await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitos (id_solucion, id_ambito)
         VALUES (?, ?)`,
        [idSolucion, idAmbito]
      );

      return { id_ambito: idAmbito, description, textoweb, prefijo, slug };
    } catch (error) {
      console.error('Error al crear el ámbito:', error);
      throw new Error('Error al crear el ámbito');
    }
  }

  // Asociar un ámbito con una solución
  async asociarAmbito(idSolucion: number, idAmbito: number): Promise<void> {
    try {
      const [result] = await pool.promise().query(
        `INSERT INTO storeSolucionesAmbitos (id_solucion, id_ambito) 
         VALUES (?, ?)`,
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

  // Obtener todos los ámbitos
  async listAmbitos(): Promise<StoreAmbitos[]> {
    try {
      const [rows] = await pool.promise().query(
        `SELECT id_ambito, description, textoweb, prefijo, slug
         FROM storeAmbitos`
      );
      return rows;
    } catch (error) {
      console.error('Error al listar los ámbitos:', error);
      throw new Error('Error al listar los ámbitos');
    }
  }

  // Obtener un ámbito por su ID
  async getAmbitoById(idAmbito: number): Promise<StoreAmbitos | null> {
    try {
      const [rows] = await pool.promise().query(
        `SELECT id_ambito, description, textoweb, prefijo, slug
         FROM storeAmbitos WHERE id_ambito = ?`,
        [idAmbito]
      );

      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error('Error al obtener el ámbito por ID:', error);
      throw new Error('Error al obtener el ámbito');
    }
  }

  // Obtener los ámbitos asociados a una solución
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

  // Actualizar un ámbito
  async update(
    idAmbito: number,
    idSolucion: number,
    updateData: Partial<StoreAmbitos & SolucionAmbito>
  ): Promise<StoreAmbitos> {
    try {
      const { description, textoweb, prefijo, slug } = updateData;

      const updateFields = [];
      const updateValues = [];

      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (textoweb) {
        updateFields.push('textoweb = ?');
        updateValues.push(textoweb);
      }
      if (prefijo) {
        updateFields.push('prefijo = ?');
        updateValues.push(prefijo);
      }
      if (slug) {
        updateFields.push('slug = ?');
        updateValues.push(slug);
      }

      updateValues.push(idAmbito);

      const [result] = await pool.promise().query(
        `UPDATE storeAmbitos SET ${updateFields.join(', ')}
         WHERE id_ambito = ?`,
        updateValues
      );

      if (result.affectedRows === 0) {
        throw new Error('No se encontró el ámbito para actualizar');
      }

      return {
        id_ambito: idAmbito,
        description: description || '',
        textoweb: textoweb || '',
        prefijo: prefijo || '',
        slug: slug || ''
      };
    } catch (error) {
      console.error('Error al actualizar el ámbito:', error);
      throw new Error('Error al actualizar el ámbito');
    }
  }

  // Eliminar un ámbito
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

  // Eliminar la relación de un ámbito con una solución
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
