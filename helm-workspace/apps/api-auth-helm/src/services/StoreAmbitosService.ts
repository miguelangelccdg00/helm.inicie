import { pool } from '../../../api-shared-helm/src/databases/conexion'; // Ajusta la ruta según corresponda
import { StoreAmbitos } from '../../../api-shared-helm/src/models/storeAmbitos';
import { SolucionAmbito } from '../../../api-shared-helm/src/models/solucionAmbito';

interface CreateAmbitoParams 
{
  description: string;
  textoweb: string;
  prefijo: string;
  slug: string;
}

interface AmbitosParams 
{
  description: string;
  textoweb: string;
  prefijo: string;
  slug: string;
}

interface AsociarAmbitoParams 
{
  id_solucion: number;
  id_ambito: number;
}

class StoreAmbitosService 
{  
  /**
   * Crea un nuevo ámbito en la base de datos y lo asocia con todas las soluciones existentes.
   * 
   * @param {CreateAmbitoParams} params - Los parámetros necesarios para crear el ámbito.
   * @returns {Promise<StoreAmbitos>} El nuevo ámbito creado, con su ID y los parámetros proporcionados.
   * @throws {Error} Si ocurre un error durante la creación o la asociación.
   */
  async createAmbito({ description, textoweb, prefijo, slug }: Omit<CreateAmbitoParams, 'idSoluciones'>): Promise<StoreAmbitos>
  {
    try
    {
      const [result]: any = await pool.promise().query(
        `INSERT INTO storeAmbitos (description, textoweb, prefijo, slug)
         VALUES (?, ?, ?, ?)`,
        [description, textoweb, prefijo, slug]
      );
  
      const idAmbito = result.insertId;
  
      // Asociar ámbito con todas las soluciones
      await pool.promise().query(`
        INSERT INTO storeSolucionesAmbitos (id_solucion, id_ambito)
        SELECT s.id_solucion, ?
        FROM storeSoluciones s
        WHERE NOT EXISTS (
          SELECT 1 FROM storeSolucionesAmbitos sa
          WHERE sa.id_solucion = s.id_solucion AND sa.id_ambito = ?
        )
      `, [idAmbito, idAmbito]);
  
      // Producto cartesiano: soluciones × nuevo ámbito × sectores
      await pool.promise().query(`
        INSERT INTO storeSolucionesAmbitosSectores (id_solucion, id_ambito, id_sector)
        SELECT s.id_solucion, ?, sec.id_sector
        FROM storeSoluciones s
        CROSS JOIN storeSectores sec
        WHERE NOT EXISTS (
          SELECT 1 FROM storeSolucionesAmbitosSectores sas
          WHERE sas.id_solucion = s.id_solucion AND sas.id_ambito = ? AND sas.id_sector = sec.id_sector
        )`, [idAmbito, idAmbito]);
  
      return {
        id_ambito: idAmbito,
        description,
        textoweb,
        prefijo,
        slug
      };
    }
    catch (error)
    {
      console.error('Error al crear el ámbito y asociarlo:', error);
      throw new Error('Error al crear el ámbito y hacer las asociaciones');
    }
  }
  
  /**
   * Crea un nuevo ámbito en la base de datos.
   * 
   * @param {AmbitosParams} params - Los parámetros necesarios para crear el ámbito.
   * @returns {Promise<StoreAmbitos>} El nuevo ámbito creado.
   * @throws {Error} Si ocurre un error durante la creación del ámbito.
   */
  async createStoreAmbito({ description, textoweb, prefijo, slug }: AmbitosParams): Promise<StoreAmbitos> 
  {
    try 
    {
      const [result]: any = await pool.promise().query(
        `INSERT INTO storeAmbitos (description, textoweb, prefijo, slug)
         VALUES (?, ?, ?, ?)`,
        [description, textoweb, prefijo, slug]
      );
  
      return {
        id_ambito: result.insertId,
        description,
        textoweb,
        prefijo,
        slug
      };
    } 
    catch (error) 
    {
      console.error('Error al crear el ámbito:', error);
      throw new Error('Error al crear el ámbito');
    }
  }

  /**
   * Asocia un ámbito con una solución específica.
   * 
   * @param {number} idSolucion - El ID de la solución a asociar.
   * @param {number} idAmbito - El ID del ámbito a asociar.
   * @returns {Promise<void>}
   * @throws {Error} Si no se puede asociar el ámbito con la solución.
   */
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

  /**
   * Obtiene todos los ámbitos registrados.
   * 
   * @returns {Promise<StoreAmbitos[]>} Una lista de los ámbitos disponibles.
   * @throws {Error} Si ocurre un error durante la consulta.
   */
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

  /**
   * Obtiene un ámbito específico por su ID.
   * 
   * @param {number} idAmbito - El ID del ámbito a obtener.
   * @returns {Promise<StoreAmbitos | null>} El ámbito correspondiente o null si no se encuentra.
   * @throws {Error} Si ocurre un error durante la consulta.
   */
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

  /**
   * Obtiene los ámbitos asociados a una solución específica.
   * 
   * @param {number} idSolucion - El ID de la solución de la cual se desean obtener los ámbitos.
   * @returns {Promise<StoreAmbitos[]>} Una lista de los ámbitos asociados a la solución.
   * @throws {Error} Si ocurre un error durante la consulta.
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
   * Actualiza los datos de un ámbito.
   * 
   * @param {number} idAmbito - El ID del ámbito a actualizar.
   * @param {number} idSolucion - El ID de la solución asociada.
   * @param {Partial<StoreAmbitos & SolucionAmbito>} updateData - Los nuevos datos para actualizar.
   * @returns {Promise<StoreAmbitos>} El ámbito actualizado.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  async update(idAmbito: number, idSolucion: number, updateData: Partial<StoreAmbitos & SolucionAmbito>): Promise<StoreAmbitos> 
  {
    try 
    {
      const { description, textoweb, prefijo, slug } = updateData;

      const updateFields = [];
      const updateValues = [];

      if (description) 
      {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (textoweb)
      {
        updateFields.push('textoweb = ?');
        updateValues.push(textoweb);
      }
      if (prefijo) 
      {
        updateFields.push('prefijo = ?');
        updateValues.push(prefijo);
      }
      if (slug) 
      {
        updateFields.push('slug = ?');
        updateValues.push(slug);
      }

      updateValues.push(idAmbito);

      const [result] = await pool.promise().query(
        `UPDATE storeAmbitos SET ${updateFields.join(', ')}
         WHERE id_ambito = ?`,
        updateValues
      );

      if (result.affectedRows === 0) 
      {
        throw new Error('No se encontró el ámbito para actualizar');
      }

      return {
        id_ambito: idAmbito,
        description: description || '',
        textoweb: textoweb || '',
        prefijo: prefijo || '',
        slug: slug || ''
      };
    } 
    catch (error) 
    {
      console.error('Error al actualizar el ámbito:', error);
      throw new Error('Error al actualizar el ámbito');
    }
  }

  /**
   * Elimina un ámbito por su ID.
   * 
   * @param {number} idAmbito - El ID del ámbito a eliminar.
   * @returns {Promise<boolean>} Indica si la eliminación fue exitosa.
   * @throws {Error} Si ocurre un error durante la eliminación.
   */
  async deleteAmbito(idAmbito: number): Promise<boolean> 
  {
    try 
    {
      const [result] = await pool.promise().query(
        `DELETE FROM storeAmbitos WHERE id_ambito = ?`,
        [idAmbito]
      );

      return result.affectedRows > 0;
    } 
    catch (error) 
    {
      console.error('Error al eliminar el ámbito:', error);
      throw new Error('Error al eliminar el ámbito');
    }
  }

  /**
   * Elimina la relación entre un ámbito y una solución.
   * 
   * @param {number} idSolucion - El ID de la solución.
   * @param {number} idAmbito - El ID del ámbito.
   * @returns {Promise<boolean>} Indica si la eliminación de la relación fue exitosa.
   * @throws {Error} Si ocurre un error durante la eliminación.
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
