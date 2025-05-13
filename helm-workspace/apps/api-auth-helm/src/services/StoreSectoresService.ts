import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreSectores } from '../../../api-shared-helm/src/models/storeSectores';
import { SolucionSector } from '../../../api-shared-helm/src/models/solucionSector';
import { SolucionAmbitoSector } from '../../../api-shared-helm/src/models/solucionAmbitoSector';


interface CreateSectorParams {
    description: string;
    textoweb: string;
    prefijo: string;
    slug: string;
    descriptionweb: string;
    titleweb: string;
    backgroundImage: string;
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
    /** 
     * Crea un nuevo sector y lo asocia automáticamente con todas las soluciones y ámbitos existentes.
     * 
     * @param {CreateSectorParams} data - Información necesaria para crear un sector.
     * @returns {Promise<StoreSectores>} Sector creado con su ID.
     * @throws {Error} Si ocurre un error al insertar o asociar registros en la base de datos.
     */
    async createSector({ description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage }: Omit<CreateSectorParams, 'idSoluciones'>): Promise<StoreSectores> {
        try {
            const [result]: any = await pool.promise().query(
                `INSERT INTO storeSectores (description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage]
            );
        
            const idSector = result.insertId;
        
            await pool.promise().query(`
                INSERT INTO storeSolucionesSectores (id_solucion, id_sector, descalternativa, textoalternativo)
                SELECT s.id_solucion, ?, '', ''
                FROM storeSoluciones s
                WHERE NOT EXISTS (
                    SELECT 1 FROM storeSolucionesSectores sa
                    WHERE sa.id_solucion = s.id_solucion AND sa.id_sector = ?
                )`, [idSector, idSector]
            );
        
            await pool.promise().query(`
                INSERT INTO storeSolucionesAmbitosSectores (id_solucion, id_ambito, id_sector)
                SELECT sa.id_solucion, sa.id_ambito, ?
                FROM storeSolucionesAmbitos sa
                CROSS JOIN (SELECT ? AS id_sector) AS sec
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM storeSolucionesAmbitosSectores sas
                    WHERE sas.id_solucion = sa.id_solucion
                    AND sas.id_ambito = sa.id_ambito
                    AND sas.id_sector = ?
                )`, [idSector, idSector, idSector]
            );     

            return {
                id_sector: idSector,
                description,
                textoweb,
                prefijo,
                slug,
                descriptionweb,
                titleweb,
                backgroundImage
            };
        } 
        catch (error) 
        {
            console.error('Error al crear el sector:', error);
            throw new Error('Error al crear el sector');
        }
    }

    /** 
     * Crea un nuevo sector sin asociaciones adicionales.
     * 
     * @param {SectorParams} data - Datos del sector.
     * @returns {Promise<StoreSectores>} Sector creado.
     * @throws {Error} Si ocurre un error al insertar el sector.
     */
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

    /** 
     * Asocia un sector a una solución específica.
     * 
     * @param {number} idSolucion - ID de la solución.
     * @param {number} idSector - ID del sector.
     * @returns {Promise<void>}
     * @throws {Error} Si no se puede realizar la asociación.
     */
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

    /** 
     * Obtiene todos los sectores registrados.
     * 
     * @returns {Promise<StoreSectores[]>} Lista de sectores.
     */
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

    async listSectoresAmbitosSolucion(): Promise<SolucionAmbitoSector[]> 
    {
        try 
        {
            const [rows] = await pool.promise().query(`
                SELECT  ssas.id_ambito,
                    ssas.id_solucion,
                    ssas.id_sector,
                    ssas.description,
                    ssas.title,
                    ssas.subtitle,
                    ssas.icon,
                    ssas.titleweb,
                    ssas.slug,
                    ssas.multimediaUri,
                    ssas.multimediaTypeId,
                    ssas.problemaTitle,
                    ssas.problemaPragma,
                    ssas.solucionTitle,
                    ssas.solucionPragma,
                    ssas.caracteristicasTitle,
                    ssas.caracteristicasPragma,
                    ssas.casosdeusoTitle,
                    ssas.casosdeusoPragma,
                    ssas.firstCtaTitle,
                    ssas.firstCtaPragma,
                    ssas.secondCtaTitle,
                    ssas.secondCtaPragma,
                    ssas.beneficiosTitle,
                    ssas.beneficiosPragma

                FROM storeSolucionesAmbitosSectores ssas JOIN storeSolucionesAmbitos sa
                JOIN storeSectores ss ON ss.id_sector = ssas.id_sector AND sa.id_ambito = ssas.id_ambito AND sa.id_solucion = ssas.id_solucion
                `);

            return rows;
        } 
        catch (error) 
        {
            console.error('Error al listar los sectores:', error);
            throw new Error('Error al listar los sectores');
        }
    }

    /** 
     * Obtiene un sector por su ID.
     * 
     * @param {number} idSector - ID del sector a buscar.
     * @returns {Promise<StoreSectores | null>} Sector encontrado o `null` si no existe.
     */
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

    /** 
     * Obtiene los sectores asociados a una solución específica.
     * 
     * @param {number} idSolucion - ID de la solución.
     * @returns {Promise<any[]>} Lista de sectores con datos de relación.
     */
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

    /** 
     * Elimina la relación entre un sector y una solución.
     * 
     * @param {number} idSolucion - ID de la solución.
     * @param {number} idSector - ID del sector.
     * @returns {Promise<boolean>} Verdadero si se eliminó correctamente.
     */
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

    /** 
     * Actualiza los datos de un sector y su relación con una solución.
     * 
     * @param {number} idSector - ID del sector.
     * @param {number} idSolucion - ID de la solución.
     * @param {Partial<StoreSectores & SolucionSector>} updateData - Datos a actualizar.
     * @returns {Promise<StoreSectores>} Sector actualizado.
     */
    async update(idSector: number, idSolucion: number, updateData: Partial<StoreSectores & SolucionSector>): Promise<StoreSectores> 
    {
        return this.updateSector(idSector, updateData);
    }

    /** 
     * Actualiza los datos de un sector.
     * 
     * @param {number} idSector - ID del sector.
     * @param {Partial<StoreSectores & SolucionSector>} updateData - Datos a actualizar.
     * @returns {Promise<StoreSectores>} Sector actualizado.
     */
    async updateSector(idSector: number, updateData: Partial<StoreSectores & SolucionSector>): Promise<StoreSectores> {
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

    /** 
     * Actualiza la relación alternativa entre un sector y una solución.
     * 
     * @param {number} idSolucion - ID de la solución.
     * @param {SolucionSector} solucionSector - Datos alternativos de la relación.
     * @returns {Promise<SolucionSector>} Relación actualizada.
     */
    async updateSolucionSectores(idSolucion: number, solucionSector: SolucionSector): Promise<SolucionSector> 
    {
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
        } 
        catch (error) 
        {
            console.error('Error al actualizar la relación sector-solución:', error);
            throw new Error('Error al actualizar la relación sector-solución');
        }
    }

    async updateSolucionAmbitoSectores(solucionAmbitoSector: SolucionAmbitoSector): Promise<SolucionAmbitoSector> 
    {
        try 
        {
            const 
            { 
                id_ambito,
                id_solucion,
                id_sector,
                titleweb,
                title,
                subtitle,
                description,
                slug,
                icon,
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
            } = solucionAmbitoSector;

            if (!id_solucion || !id_sector || !id_ambito) 
            {
                throw new Error('Faltan id_solucion, id_sector o id_ambito para actualizar la relación');
            }

            const [rows] = await pool.promise().query(
                `SELECT * FROM storeSolucionesAmbitosSectores 
                WHERE id_solucion = ? AND id_sector = ? AND id_ambito = ?`,
                [id_solucion, id_sector, id_ambito]
            ) as any[];

            if (!rows || rows.length === 0) {
                throw new Error('No existe la relación ambito-sector-solución para actualizar');
            }

            await pool.promise().query(
                `UPDATE storeSolucionesAmbitosSectores SET
                    titleweb = ?, 
                    title = ?, 
                    subtitle = ?,  
                    description = ?, 
                    slug = ?, 
                    icon = ?, 
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
                WHERE id_solucion = ? AND id_sector = ? AND id_ambito = ?`,
                [
                    titleweb,
                    title,
                    subtitle,
                    description,
                    slug,
                    icon,
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
                    beneficiosPragma,
                    id_solucion,
                    id_sector,
                    id_ambito
                ]
            );

            return solucionAmbitoSector;
        } 
        catch (error) 
        {
            console.error('Error al actualizar la relación ambito-sector-solución:', error);
            throw new Error('Error al actualizar la relación ambito-sector-solución');
        }
    }


    /** 
     * Elimina un sector y su relación con una solución.
     * 
     * @param {number} idSolucion - ID de la solución.
     * @param {number} idSector - ID del sector.
     * @returns {Promise<boolean>} Verdadero si se eliminó correctamente.
     */
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

    /**
     * Elimina una relación ambito-sector-solución específica.
     * 
     * @param {number} idSolucion - ID de la solución.
     * @param {number} idSector - ID del sector.
     * @param {number} idAmbito - ID del ámbito.
     * @returns {Promise<boolean>} Verdadero si se eliminó al menos una fila.
     */
    async deleteSolucionSectorAmbito(idSolucion: number, idSector: number, idAmbito: number): Promise<boolean> 
    {
        try 
        {
            const [result] = await pool.promise().query(
                `DELETE FROM storeSolucionesAmbitosSectores WHERE id_solucion = ? AND id_sector = ? AND id_ambito = ?`,
                [idSolucion, idSector, idAmbito]
            );

            return result.affectedRows > 0;
        } 
        catch (error) 
        {
            console.error('Error al eliminar el sector:', error);
            throw new Error('Error al eliminar el sector');
        }
    }

    /** 
     * Elimina un sector por su ID.
     * 
     * @param {number} idSector - ID del sector.
     * @returns {Promise<boolean>} Verdadero si se eliminó correctamente.
     */
    async deleteSectorById(idSector: number): Promise<boolean> {
        try {
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
}

export default new StoreSectoresService();
