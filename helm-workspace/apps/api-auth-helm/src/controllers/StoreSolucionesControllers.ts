import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import { StoreSoluciones } from '../models/storeSoluciones';

class StoreSolucionesControllers
{
    async listStoreSoluciones(req: Request, res:Response): Promise<void>
    {
        try 
        {
            const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones');
            res.json(rows);            
        } 
        catch (error) 
        {
            console.error('Error al al listar soluciones: ', error);
            console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new StoreSolucionesControllers();