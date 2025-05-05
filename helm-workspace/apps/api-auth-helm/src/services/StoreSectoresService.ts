import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreSectores } from '../../../api-shared-helm/src/models/storeSectores';
import { SolucionSector } from '../../../api-shared-helm/src/models/solucionSector';

interface CreateSectorParams {
    description: string;
    textoweb: string;
    prefijo: string;
    slug: string;
    descriptionweb: string;
    titleweb: string;
    backgroundImage: string;
    idSolucion: number;
}

interface SectorParams {
    description: string;
    textoweb: string;
    prefijo: string;
    slug: string;
    descriptionweb: string;
    titleweb: string;
    backgroundImage: string;
}

class StoreSectoresService 
{
    async createSector({ description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage, idSolucion }: CreateSectorParams): Promise<StoreSectores> {
        try {
            const [result] = await pool.promise().query(
                `INSERT INTO storeSectores (description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage]
            );
            const idSector = result.insertId;

            await pool.promise().query(
                `INSERT INTO storeSolucionesSectores (id_solucion, id_sector, descalternativa, textoalternativo)
                 VALUES (?, ?, ?, ?)`,
                [idSolucion, idSector, '', '']
            );

            return { id_sector: idSector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage };
        } catch (error) {
            console.error('Error al crear el sector:', error);
            throw new Error('Error al crear el sector');
        }
    }

    async createStoreSector({ description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage }: SectorParams): Promise<StoreSectores> {
        try {
            const [result] = await pool.promise().query(
                `INSERT INTO storeSectores (description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage]
            );
            const idSector = result.insertId;

            return { id_sector: idSector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage };
        } catch (error) {
            console.error('Error al crear el sector:', error);
            throw new Error('Error al crear el sector');
        }
    }

    async asociarSector(idSolucion: number, idSector: number): Promise<void> {
        try {
            const [result] = await pool.promise().query(
                `INSERT INTO storeSolucionesSectores (id_solucion, id_sector, descalternativa, textoalternativo)
                 VALUES (?, ?, ?, ?)`,
                [idSolucion, idSector, '', '']
            );

            if (result.affectedRows === 0) {
                throw new Error('No se pudo asociar el sector');
            }
        } catch (error) {
            console.error('Error al asociar el sector:', error);
            throw new Error('Error al asociar el sector');
        }
    }

    async asociarTodosSectoresConTodasSoluciones(): Promise<void> 
    {
        try 
        {
            const [result] = await pool.promise().query(`
                INSERT INTO storeSolucionesSectores (id_solucion, id_sector, descalternativa, textoalternativo)
                SELECT s.id_solucion, se.id_sector, '', ''
                FROM storeSoluciones s
                CROSS JOIN storeSectores se
                WHERE NOT EXISTS (
                    SELECT 1 FROM storeSolucionesSectores ss
                    WHERE ss.id_solucion = s.id_solucion AND ss.id_sector = se.id_sector
                )`);

            if (result.affectedRows > 0)
            {
                console.log('Asociaciones de sectores con soluciones fueron exitosas.');
            } 
            else 
            {
                console.log('No se realizaron nuevas asociaciones.');
            }
        } 
        catch (error) 
        {
            console.error('Error al asociar todos los sectores con todas las soluciones:', error);
            throw new Error('Error en la asociación masiva de sectores con soluciones.');
        }
    }

    async asociarSectoresAmbitosSoluciones(): Promise<void> 
    {
        try 
        {
            const [result] = await pool.promise().query(`
                INSERT INTO storeSolucionesAmbitosSectores (
                    id_solucion, id_ambito, id_sector, 
                    titleweb, title, subtitle, thread_id, description, slug, icon,
                    multimediaUri, multimediaTypeId,
                    problemaTitle, problemaPragma,
                    solucionTitle, solucionPragma,
                    caracteristicasTitle, caracteristicasPragma,
                    casosdeusoTitle, casosdeusoPragma,
                    firstCtaTitle, firstCtaPragma,
                    secondCtaTitle, secondCtaPragma,
                    beneficiosTitle, beneficiosPragma
                )
                SELECT 
                    s.id_solucion, a.id_ambito, se.id_sector,
                    '', '', '', '', '', '', '',
                    '', NULL,
                    '', '',
                    '', '',
                    '', '',
                    '', '',
                    '', '',
                    '', '',
                    '', ''
                FROM storeSoluciones s
                CROSS JOIN storeAmbitos a
                CROSS JOIN storeSectores se
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM storeSolucionesAmbitosSectores ss
                    WHERE 
                        ss.id_solucion = s.id_solucion AND 
                        ss.id_ambito = a.id_ambito AND 
                        ss.id_sector = se.id_sector
                )
            `);

            if (result.affectedRows > 0)
            {
                console.log('Asociaciones fueron exitosas.');
            } 
            else 
            {
                console.log('No se realizaron nuevas asociaciones.');
            }
        } 
        catch (error) 
        {
            console.error('Error al asociar soluciones con ámbitos y sectores:', error);
            throw new Error('Error en la asociación masiva.');
        }
    }


    async listSectores(): Promise<StoreSectores[]> {
        try {
            const [rows] = await pool.promise().query(
                `SELECT id_sector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage
                 FROM storeSectores`
            );
            return rows;
        } catch (error) {
            console.error('Error al listar los sectores:', error);
            throw new Error('Error al listar los sectores');
        }
    }

    async getSectorById(idSector: number): Promise<StoreSectores | null> {
        try {
            const [rows] = await pool.promise().query(
                `SELECT id_sector, description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage
                 FROM storeSectores WHERE id_sector = ?`,
                [idSector]
            );
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.error('Error al obtener el sector por ID:', error);
            throw new Error('Error al obtener el sector');
        }
    }

    async getByIdSectores(idSolucion: number): Promise<any[]> {
        try {
            const [rows] = await pool.promise().query(
                `SELECT 
                    a.id_sector, a.description, a.textoweb, a.prefijo, a.slug, 
                    a.descriptionweb, a.titleweb, a.backgroundImage,
                    sa.descalternativa, sa.textoalternativo
                 FROM storeSectores a
                 JOIN storeSolucionesSectores sa ON a.id_sector = sa.id_sector
                 WHERE sa.id_solucion = ?`,
                [idSolucion]
            );
            return rows;
        } catch (error) {
            console.error('Error al obtener los sectores por ID de solución:', error);
            throw new Error('Error al obtener los sectores');
        }
    }

    async deleteSolucionSector(idSolucion: number, idSector: number): Promise<boolean> {
        try {
            const [result] = await pool.promise().query(
                `DELETE FROM storeSolucionesSectores 
                 WHERE id_solucion = ? AND id_sector = ?`,
                [idSolucion, idSector]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar la relación sector-solución:', error);
            throw new Error('Error al eliminar la relación sector-solución');
        }
    }

    async update(idSector: number, idSolucion: number, updateData: Partial<StoreSectores & SolucionSector>): Promise<StoreSectores> {
        try {
            const { description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage } = updateData;

            const updateFields = [];
            const updateValues = [];

            if (description) { updateFields.push('description = ?'); updateValues.push(description); }
            if (textoweb) { updateFields.push('textoweb = ?'); updateValues.push(textoweb); }
            if (prefijo) { updateFields.push('prefijo = ?'); updateValues.push(prefijo); }
            if (slug) { updateFields.push('slug = ?'); updateValues.push(slug); }
            if (descriptionweb) { updateFields.push('descriptionweb = ?'); updateValues.push(descriptionweb); }
            if (titleweb) { updateFields.push('titleweb = ?'); updateValues.push(titleweb); }
            if (backgroundImage) { updateFields.push('backgroundImage = ?'); updateValues.push(backgroundImage); }

            updateValues.push(idSector);

            const [result] = await pool.promise().query(
                `UPDATE storeSectores SET ${updateFields.join(', ')}
                 WHERE id_sector = ?`,
                updateValues
            );

            if (result.affectedRows === 0) {
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
        } catch (error) {
            console.error('Error al actualizar el sector:', error);
            throw new Error('Error al actualizar el sector');
        }
    }

    async updateSector(idSector: number, updateData: Partial<StoreSectores & SolucionSector>): Promise<StoreSectores> 
    {
        try 
        {
            const { description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage } = updateData;

            const updateFields = [];
            const updateValues = [];

            if (description) { updateFields.push('description = ?'); updateValues.push(description); }
            if (textoweb) { updateFields.push('textoweb = ?'); updateValues.push(textoweb); }
            if (prefijo) { updateFields.push('prefijo = ?'); updateValues.push(prefijo); }
            if (slug) { updateFields.push('slug = ?'); updateValues.push(slug); }
            if (descriptionweb) { updateFields.push('descriptionweb = ?'); updateValues.push(descriptionweb); }
            if (titleweb) { updateFields.push('titleweb = ?'); updateValues.push(titleweb); }
            if (backgroundImage) { updateFields.push('backgroundImage = ?'); updateValues.push(backgroundImage); }

            updateValues.push(idSector);

            const [result] = await pool.promise().query(
                `UPDATE storeSectores SET ${updateFields.join(', ')}
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

    async updateSolucionSectores(idSolucion: number, solucionSector: SolucionSector): Promise<SolucionSector> {
        try {
            const { id_sector, descalternativa, textoalternativo } = solucionSector;

            if (!idSolucion || !id_sector) {
                throw new Error('Faltan id_solucion o id_sector para actualizar la relación');
            }

            const [rows] = await pool.promise().query(
                `SELECT * FROM storeSolucionesSectores 
                 WHERE id_solucion = ? AND id_sector = ?`,
                [idSolucion, id_sector]
            ) as any[];

            if (!rows || rows.length === 0) {
                throw new Error('No existe la relación sector-solución para actualizar');
            }

            await pool.promise().query(
                `UPDATE storeSolucionesSectores 
                 SET descalternativa = ?, textoalternativo = ?
                 WHERE id_solucion = ? AND id_sector = ?`,
                [descalternativa || '', textoalternativo || '', idSolucion, id_sector]
            );

            return {
                id_solucion: idSolucion,
                id_sector: id_sector,
                descalternativa: descalternativa || '',
                textoalternativo: textoalternativo || ''
            };
        } catch (error) {
            console.error('Error al actualizar la relación sector-solución:', error);
            throw new Error('Error al actualizar la relación sector-solución');
        }
    }

    async deleteSector(idSolucion: number, idSector: number): Promise<boolean> {
        try {
            await pool.promise().query(
                `DELETE FROM storeSolucionesSectores WHERE id_solucion = ? AND id_sector = ?`,
                [idSolucion, idSector]
            );

            const [result] = await pool.promise().query(
                `DELETE FROM storeSectores WHERE id_sector = ?`,
                [idSector]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar el sector:', error);
            throw new Error('Error al eliminar el sector');
        }
    }

    async deleteSectorById(idSector: number): Promise<boolean> 
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
}

export default new StoreSectoresService();
