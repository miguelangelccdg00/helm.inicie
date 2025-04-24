import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreSectores } from '../../../api-shared-helm/src/models/storeSectores';
import { SolucionSector } from '../../../api-shared-helm/src/models/solucionSector';

interface CreateSectorParams
{
    description: string;
    textoweb: string;
    prefijo: string;
    slug: string;
    descriptionweb: string;
    titleweb: string;
    backgroundImage: string;
    idSolucion: number;
}

interface AsociarSectorParams 
{
    id_solucion: number;
    id_sector: number;
}

class StoreSectoresService
{
    // Crear un nuevo sector
    async createSector({description,textoweb,prefijo,slug,descriptionweb,titleweb,backgroundImage,idSolucion }: CreateSectorParams): Promise<StoreSectores> {
        try {
            const [result] = await pool.promise().query(
            `INSERT INTO storeSectores (description,textoWeb,prefijo,slug,descriptionweb,titleweb,backgroundImage)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage]
            );
            const idSector = result.insertId;

            // Asociamos el nuevo sector con la solución proporcionada
            await pool.promise().query(
            `INSERT INTO storeSolucionesSectores (id_solucion, id_sector)
                VALUES (?, ?)`,
            [idSolucion, idSector]
            );

            return { id_sector: idSector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage};
        } 
        catch (error) 
        {
            console.error('Error al crear el sector:', error);
            throw new Error('Error al crear el sector');
        }
    }

    // Asociar un sector con una solución
    async asociarSector(idSolucion: number, idSector: number): Promise<void> 
    {
        try 
        {
            const [result] = await pool.promise().query(
            `INSERT INTO storeSolucionesSectores (id_solucion, id_sector) 
                VALUES (?, ?)`,
            [idSolucion, idSector]
            );

            if (result.affectedRows === 0) 
            {
            throw new Error('No se pudo asociar el sector');
            }
        } 
        catch (error) 
        {
            console.error('Error al asociar el sector:', error);
            throw new Error('Error al asociar el sector');
        }
    }
    
    // Obtener todos los sectores
    async listSectores(): Promise<StoreSectores[]> 
    {
        try
        {
            const [rows] = await pool.promise().query(
            `SELECT id_sector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage
                FROM storeSectores`
            );
            return rows;
        } 
        catch (error) 
        {
            console.error('Error al listar los sectores:', error);
            throw new Error('Error al listar los sectores');
        }
    }
        
    // Obtener un sector por su ID
    async getSectorById(idSector: number): Promise<StoreSectores | null> 
    {
        try 
        {
            const [rows] = await pool.promise().query(
            `SELECT id_sector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage
                FROM storeSectores WHERE id_sector = ?`,
            [idSector]
            );

            return rows.length ? rows[0] : null;
        } 
        catch (error) 
        {
            console.error('Error al obtener el sector por ID:', error);
            throw new Error('Error al obtener el sector');
        }
    }

    // Obtener los sectores asociados a una solución
    async getByIdSectores(idSolucion: number): Promise<StoreSectores[]> 
    {
        try 
        {
            const [rows] = await pool.promise().query(
            `SELECT a.id_sector, a.description, a.textoweb, a.prefijo, a.slug, a.descriptionweb, a.titleweb, a.backgroundImage
                FROM storeSectores a
                JOIN storeSolucionesSectores sa ON a.id_sector = sa.id_sector
                WHERE sa.id_solucion = ?`,
            [idSolucion]
            );
            return rows;
        } 
        catch (error) 
        {
            console.error('Error al obtener los sectores por ID de solución:', error);
            throw new Error('Error al obtener los sectores');
        }
    }
    
    // Actualizar un sector
    async update(idSector: number, idSolucion: number,updateData: Partial<StoreSectores & SolucionSector>): Promise<StoreSectores> 
    {
        try 
        {
            const { description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage } = updateData;

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

            if (descriptionweb) 
            {
            updateFields.push('descriptionweb = ?');
            updateValues.push(descriptionweb);
            }
            if (titleweb) 
            {
            updateFields.push('titleweb = ?');
            updateValues.push(titleweb);
            }
            if (backgroundImage) 
            {
            updateFields.push('backgroundImage = ?');
            updateValues.push(backgroundImage);
            }

            updateValues.push(idSector);

            const [result] = await pool.promise().query(
            `UPDATE storeAmbitos SET ${updateFields.join(', ')}
                WHERE id_sector = ?`,
            updateValues
            );

            if (result.affectedRows === 0) 
            {
            throw new Error('No se encontró el sector para actualizar');
            }
            return {
                id_sector: idSector,
                description: description || '',
                textoweb: textoweb || '',
                prefijo: prefijo || '',
                slug: slug || '',
                descriptionweb: descriptionweb || '',
                titleweb: titleweb || '',
                backgroundImage: backgroundImage || ''
            };
        } 
        catch (error) 
        {
            console.error('Error al actualizar el sector:', error);
            throw new Error('Error al actualizar el sector');
        }
    }

  // Eliminar un sector
  async deleteSector(idSector: number): Promise<boolean> 
  {
    try 
    {
      const [result] = await pool.promise().query(
        `DELETE FROM storeSectores WHERE id_sector = ?`,
        [idSector]
      );

      return result.affectedRows > 0;
    } 
    catch (error) 
    {
      console.error('Error al eliminar el sector:', error);
      throw new Error('Error al eliminar el sector');
    }
  }

  // Eliminar la relación de un sector con una solución
  async deleteSectorSolucion(idSolucion: number, idSector: number): Promise<boolean> 
  {
    try 
    {
      const [result] = await pool.promise().query(
        `DELETE FROM storeSolucionesSectores WHERE id_solucion = ? AND id_sector = ?`,
        [idSolucion, idSector]
      );

      return result.affectedRows > 0;
    } 
    catch (error)
    {
      console.error('Error al eliminar la relación de sector-solución:', error);
      throw new Error('Error al eliminar la relación');
    }
  }

}

export  default new StoreSectoresService();