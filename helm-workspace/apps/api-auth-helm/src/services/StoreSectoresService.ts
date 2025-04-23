import { pool } from '../../../api-shared-helm/src/databases/conexion';
import { StoreSectores } from '../../../api-shared-helm/src/models/storeSectores';

interface CreateSectorParams
{
    description: string;
    textoWeb: string;
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
    async createSector({description,textoWeb,prefijo,slug,descriptionweb,titleweb,backgroundImage,idSolucion }: CreateSectorParams): Promise<StoreSectores> {
        try {
            const [result] = await pool.promise().query(
            `INSERT INTO storeSectores (description,textoWeb,prefijo,slug,descriptionweb,titleweb,backgroundImage)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage]
            );
            const idSector = result.insertId;

            // Asociamos el nuevo sector con la solución proporcionada
            await pool.promise().query(
            `INSERT INTO storeSolucionesSectores (id_solucion, id_sector)
                VALUES (?, ?)`,
            [idSolucion, idSector]
            );

            return { id_sector: idSector, description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage};
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
    // Obtener variantes por solución y sector
    async getVariantesBySolucionAndSector(idSolucion: number): Promise<any[]> 
    {
        try 
        {
            const [rows] = await pool.promise().query(
                `SELECT v.id_variantes, v.description
                FROM storeVariantes v
                JOIN storeSectores a ON v.id_sector = a.id_sector
                WHERE a.id_solucion = ?`,
                [idSolucion]
            );
            return rows;
        } 
        catch (error) 
        {
            console.error('Error al obtener las variantes por solución y sector:', error);
            throw new Error('Error al obtener las variantes');
        }
    }

}

export  default new StoreSectoresService();