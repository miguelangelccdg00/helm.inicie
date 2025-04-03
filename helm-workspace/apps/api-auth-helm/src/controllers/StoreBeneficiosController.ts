import { Request, Response } from 'express';
import { StoreBeneficios } from "../models/storeBeneficios";
import storeBeneficiosService from '../services/StoreBeneficiosService';

class StoreBeneficiosControllers 
{
    /** Creación de beneficios de una solución */
    async createBeneficio(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description } = req.body;
    
            if (!description || !idSolucion) 
            {
                res.status(400).json({ message: 'Faltan datos del beneficio' });
                return;
            }
    
            // Insertar el beneficio y relacionarlo
            const beneficio = await storeBeneficiosService.createBeneficio({ description, idSolucion });
    
            res.status(201).json({ 
                message: 'Beneficio creado y relacionado con la solución con éxito',
                beneficio
            });
        } 
        catch (error)
        {
            console.error('Error creando el beneficio:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
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

            const beneficiosSolucion = await storeBeneficiosService.getByIdBeneficio(Number(idSolucion));

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

    /** Listado de beneficios de una solución */
    async listCompleteBeneficios(req: Request, res: Response): Promise<void> 
    {
        try 
        {

            const listBeneficio = await storeBeneficiosService.getBeneficio();

            if (!listBeneficio.length) 
            {
                res.status(404).json({ message: 'No existen beneficios' });
                return;
            }

            res.status(200).json(listBeneficio);

        } 
        catch (error) 
        {
            console.error('Error obteniendo beneficios:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }


    /** Eliminacion de beneficios de una solución */
    async deleteBeneficio(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idBeneficio } = req.params;

            if (!idBeneficio) 
            {
                res.status(400).json({ message: 'ID no proporcionado' });
                return;
            }

            const wasDeleted = await storeBeneficiosService.deleteBeneficio(Number(idBeneficio));

            if (!wasDeleted) 
            {
                res.status(404).json({ message: 'Beneficio no encontrado o ya eliminado' });
                return;
            }

            res.status(200).json({ message: 'Beneficio eliminado correctamente' });
        } 
        catch (error) 
        {
            console.error('Error al eliminar el beneficio:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    /** Asociar un beneficio existente a una solución */
    async asociarBeneficio(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id_solucion, id_beneficio } = req.body;
    
            if (!id_solucion) 
            {
                res.status(401).json({ message: 'Faltan datos para la asociación en el id_solucion' });
                return;
            }
            if (!id_beneficio) 
            {
                res.status(402).json({ message: 'Faltan datos para la asociación en el id_beneficio' });
                return;
            }
    
            // Asociar el beneficio a la solución
            const asociacion = await storeBeneficiosService.asociarBeneficio(id_solucion, id_beneficio);
    
            res.status(201).json({ 
                message: 'Beneficio asociado a la solución con éxito',
                asociacion
            });
        } 
        catch (error)
        {
            console.error('Error asociando el beneficio:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default new StoreBeneficiosControllers();