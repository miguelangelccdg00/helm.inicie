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

}

export  default new StoreSectoresService();