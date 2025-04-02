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
            console.error('Error creando el beneficio:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

}

export default new StoreProblemasController();