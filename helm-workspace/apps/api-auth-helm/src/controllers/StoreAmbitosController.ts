import { Request, Response } from 'express';
import StoreAmbitosService from '../services/StoreAmbitosService';

class StoreAmbitosController 
{
    /**
     * Crea un nuevo ámbito y lo asocia a una solución con todos los datos replicados.
     */
    async createAmbitos(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description, textoweb, prefijo, slug } = req.body;

            if (!description || !textoweb || !prefijo || !slug || !idSolucion) 
            {
                res.status(400).json({ message: 'Faltan datos requeridos para crear el ámbito.' });
                return;
            }

            const resultado = await StoreAmbitosService.createAmbito({
                description,
                textoweb,
                prefijo,
                slug,
                idSolucion
            });

            res.status(201).json(resultado);
        } 
        catch (error) 
        {
            console.error('Error en createAmbitos:', error);
            res.status(500).json({ message: 'Error interno del servidor al crear el ámbito.' });
        }
    }
}

export default new StoreAmbitosController();
