import { Request, Response } from 'express';
import StoreSolucionesService from '../services/StoreSolucionesService';

class StoreSolucionesController 
{
    async listStoreSoluciones(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const soluciones = await StoreSolucionesService.getAll();
            res.json(soluciones);
        } 
        catch (error) 
        {
            console.error('Error al listar storeSoluciones:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    async listIdStoreSoluciones(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id } = req.params;

            if (!id) 
            {
                res.status(400).json({ message: 'ID no proporcionado' });
                return;
            }

            const solucion = await StoreSolucionesService.getById(Number(id));
            
            if (!solucion) 
            {
                res.status(404).json({ message: 'Solución no encontrada' });
                return;
            }

            res.json(solucion);
        } 
        catch (error) 
        {
            console.error('Error al obtener storeSoluciones:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    async modifyStoreSoluciones(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) 
            {
                res.status(400).json({ message: 'ID no proporcionado' });
                return;
            }
            if (!Object.keys(updateData).length) 
            {
                res.status(400).json({ message: 'No se proporcionaron datos' });
                return;
            }

            const result = await StoreSolucionesService.update(Number(id), updateData);
            res.json(result);
        } 
        catch (error) 
        {
            console.error('Error al modificar storeSoluciones:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new StoreSolucionesController();
