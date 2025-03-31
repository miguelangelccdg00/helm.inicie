import { Request, Response } from 'express';
import StoreSolucionesService from '../services/StoreSolucionesService';

class StoreSolucionesController 
{
    /**
     * Obtiene todas las soluciones almacenadas en la base de datos.
     */
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

    /**
     * Obtiene una solución específica por su ID.
     */
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

    /**
     * Modifica una solución almacenada en la base de datos.
     */
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

    /** Listado de beneficios de una solución */
    async listBeneficios(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idSolucion } = req.params;

            if (!idSolucion) 
            {
                res.status(400).json({ message: 'ID de la solución no proporcionado' });
                return;
            }

            const beneficiosSolucion = await StoreSolucionesService.getByIdBeneficio(Number(idSolucion));

            if (!beneficiosSolucion.length) 
            {
                res.status(404).json({ message: 'No se encontraron beneficios para esta solución' });
                return;
            }

            res.status(200).json(beneficiosSolucion);
            
        } 
        catch (error) 
        {
            console.error('Error obteniendo beneficios:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

}

export default new StoreSolucionesController();
