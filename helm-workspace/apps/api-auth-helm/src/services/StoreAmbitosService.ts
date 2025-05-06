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
  async update(idAmbito: number,idSolucion: number,updateData: Partial<StoreAmbitos & SolucionAmbito>): Promise<StoreAmbitos> 
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

  // Actualizar un ámbito
  async updateAmbito(idAmbito: number,updateData: Partial<StoreAmbitos & SolucionAmbito>): Promise<StoreAmbitos> 
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

  async updateSolucionAmbitos(idSolucion: number, solucionAmbito: SolucionAmbito): Promise<SolucionAmbito> 
  {
    try 
    {
      const 
      {
        id_ambito,
        description,
        title,
        subtitle,
        icon,
        titleweb,
        slug,
        multimediaUri,
        multimediaTypeId,
        problemaTitle,
        problemaPragma,
        solucionTitle,
        solucionPragma,
        caracteristicasTitle,
        caracteristicasPragma,
        casosdeusoTitle,
        casosdeusoPragma,
        firstCtaTitle,
        firstCtaPragma,
        secondCtaTitle,
        secondCtaPragma,
        beneficiosTitle,
        beneficiosPragma
      } = solucionAmbito;
  
      if (!idSolucion || !id_ambito) 
      {
        throw new Error('Faltan id_solucion o id_ambito para actualizar la relación');
      }
  
      const [rows] = await pool.promise().query(
        `SELECT * FROM storeSolucionesAmbitos 
         WHERE id_solucion = ? AND id_ambito = ?`,
        [idSolucion, id_ambito]
      ) as any[];
  
      if (!rows || rows.length === 0) 
      {
        throw new Error('No existe la relación ambito-solución para actualizar');
      }
  
      await pool.promise().query(
        `UPDATE storeSolucionesAmbitos 
         SET 
           description = ?,
           title = ?,
           subtitle = ?,
           icon = ?,
           titleweb = ?,
           slug = ?,
           multimediaUri = ?,
           multimediaTypeId = ?,
           problemaTitle = ?,
           problemaPragma = ?,
           solucionTitle = ?,
           solucionPragma = ?,
           caracteristicasTitle = ?,
           caracteristicasPragma = ?,
           casosdeusoTitle = ?,
           casosdeusoPragma = ?,
           firstCtaTitle = ?,
           firstCtaPragma = ?,
           secondCtaTitle = ?,
           secondCtaPragma = ?,
           beneficiosTitle = ?,
           beneficiosPragma = ?
         WHERE id_solucion = ? AND id_ambito = ?`,
        [
          description || '',
          title || '',
          subtitle || '',
          icon || '',
          titleweb || '',
          slug || '',
          multimediaUri || '',
          multimediaTypeId || '',
          problemaTitle || '',
          problemaPragma || '',
          solucionTitle || '',
          solucionPragma || '',
          caracteristicasTitle || '',
          caracteristicasPragma || '',
          casosdeusoTitle || '',
          casosdeusoPragma || '',
          firstCtaTitle || '',
          firstCtaPragma || '',
          secondCtaTitle || '',
          secondCtaPragma || '',
          beneficiosTitle || '',
          beneficiosPragma || '',
          idSolucion,
          id_ambito
        ]
      );
  
      return {
        id_solucion: idSolucion,
        id_ambito: id_ambito,
        description: description || '',
        title: title || '',
        subtitle: subtitle || '',
        icon: icon || '',
        titleweb: titleweb || '',
        slug: slug || '',
        multimediaUri: multimediaUri || '',
        multimediaTypeId: multimediaTypeId || '',
        problemaTitle: problemaTitle || '',
        problemaPragma: problemaPragma || '',
        solucionTitle: solucionTitle || '',
        solucionPragma: solucionPragma || '',
        caracteristicasTitle: caracteristicasTitle || '',
        caracteristicasPragma: caracteristicasPragma || '',
        casosdeusoTitle: casosdeusoTitle || '',
        casosdeusoPragma: casosdeusoPragma || '',
        firstCtaTitle: firstCtaTitle || '',
        firstCtaPragma: firstCtaPragma || '',
        secondCtaTitle: secondCtaTitle || '',
        secondCtaPragma: secondCtaPragma || '',
        beneficiosTitle: beneficiosTitle || '',
        beneficiosPragma: beneficiosPragma || ''
      };
    } 
    catch (error) 
    {
      console.error('Error al actualizar la relación ambito-solución:', error);
      throw new Error('Error al actualizar la relación ambito-solución');
    }
  }
  

  // Eliminar un ámbito
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
