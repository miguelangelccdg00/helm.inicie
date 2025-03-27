import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import { StoreSoluciones } from '../models/storeSoluciones';

class StoreSolucionesControllers
{
    constructor() {}

    listStoreSoluciones = async (req: Request, res:Response): Promise<void> =>
    {
        try 
        {
            const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones');
            res.json(rows);            
        } 
        catch (error) 
        {
            console.error('Error al listar storeSoluciones: ', error);
            console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    listIdStoreSoluciones = async (req: Request, res:Response): Promise<void> =>
    {
        try 
        {
            const { id } = req.params;
            if (!id) 
            {
                res.status(400).json({ message: 'ID de solución no proporcionado' });
                return;                
            }
            const [rows] = await pool.promise().query('SELECT * FROM storeSoluciones WHERE id_solucion = ?', [id]);

            if (rows.length === 0) 
            {
                res.status(404).json({ message: 'Solución no encontrada' });
                return;
            }
    
            res.json(rows[0]);             
        } 
        catch (error) 
        {
            console.error('Error al listar storeSoluciones: ', error);
            console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }



    modifyStoreSoluciones = async (req: Request, res: Response): Promise<void> => 
    {
        try 
        {
            const { id } = req.params;
            const updateStoreSoluciones: Partial<StoreSoluciones> = req.body;

            if (!id) 
            {
                res.status(400).json({ message: 'ID de solución no proporcionado' });
                return;
            }

            if (Object.keys(updateStoreSoluciones).length === 0) 
            {
                res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
                return;
            }

            await pool.promise().query('UPDATE storeSoluciones SET ? WHERE id_solucion = ?', [updateStoreSoluciones, id]);
            res.json({ message: 'StoreSoluciones actualizado'})
        } 
        catch (error)
        {
            console.log('Error al modificar storeSoluciones ', error);
            console.log('Error details: ', error instanceof Error ? error.message : 'Unknown error');  
            res.status(500).json({ message: 'Error interno en el servidor' });         
        }
    }
}

export default new StoreSolucionesControllers();