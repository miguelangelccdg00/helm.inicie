import { Request, Response } from 'express';
import storeBeneficiosService from '../services/StoreBeneficiosService';

class StoreBeneficiosControllers 
{
    /** Creación de beneficios de una solución */
    async createBeneficio(req: Request, res: Response): Promise<void> {
        try {
            const { title, description } = req.body;
    
            if (!title || !description) {
                res.status(400).json({ message: 'Faltan datos: título o descripción' });
                return;
            }
    
            // Aquí llamas a tu servicio para insertar los datos en la base
            const solucionId = await storeBeneficiosService.createBeneficio(title, description);
    
            res.status(201).json({ 
                message: 'Beneficio y solución creados con éxito', 
                id_solucion: solucionId 
            });
        } catch (error) {
            console.error('Error creando la solución y el beneficio:', error);
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
}

export default new StoreBeneficiosControllers();
