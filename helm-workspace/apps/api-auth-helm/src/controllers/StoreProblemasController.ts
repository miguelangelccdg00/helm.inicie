import { Request, Response } from 'express';
import { StoreProblemas } from "../models/storeProblemas";
import storeProblemasService from '../services/StoreProblemasService';

class StoreProblemasController
{
    constructor() {}

    async createProblema(req: Request, res: Response): Promise <void>
    {
        try 
        {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description } = req.body;
            
            if (!description || !idSolucion) 
            {
                res.status(401).json({ message: 'Faltan datos del problema' })   
                return;
            }

            const problema = await storeProblemasService.createProblema({ description, idSolucion});
            res.status(201).json({ message: 'Problema creado y relacionado con la solución con éxito',problema });

        } 
        catch (error)
        {
            console.error('Error creando el problema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async listProblema(req: Request, res: Response): Promise <void>
    {
        try 
        {
               
            const listProblema = await storeProblemasService.getProblemas();

            if (!listProblema.length) 
            {
                res.status(404).json({ message: 'No existen problemas' });
                return;
            }

            res.status(202).json(listProblema);

        } 
        catch (error)
        {
            console.error('Error creando el problema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async listIdProblema(req: Request, res: Response): Promise <void>
    {
        try 
        {
            
            const { idSolucion } = req.params;

            if (!idSolucion) 
            {
                res.status(400).json({ message: 'ID de la solución no proporcionado' });
                return;
            }

            const problemasSolucion = await storeProblemasService.getByIdProblemas(Number(idSolucion));

            if (!problemasSolucion.length) 
            {
                res.status(404).json({ message: 'No se encontraron problemas para esta solución' });
                return;
            }

            res.status(200).json(problemasSolucion);
        } 
        catch (error)
        {
            console.error('Error creando el problema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async asociarProblema(req: Request, res: Response) 
    {
        try 
        {
            const { id_solucion, id_problema } = req.body;
    
            if (!id_solucion) 
            {
                res.status(401).json({ message: 'Faltan datos para la asociación en el id_solucion' });
                return;
            }
            if (!id_problema) 
            {
                res.status(402).json({ message: 'Faltan datos para la asociación en el id_problema' });
                return;
            }
    
            // Asociar el beneficio a la solución
            const asociacion = await storeProblemasService.asociarProblema(id_solucion, id_problema);
    
            res.status(201).json({ 
                message: 'Problema asociado a la solución con éxito',
                asociacion
            });
        } 
        catch (error)
        {
            console.error('Error asociando el problema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

}

export default new StoreProblemasController();