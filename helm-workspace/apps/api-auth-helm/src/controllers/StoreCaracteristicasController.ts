import { Request, Response } from 'express';
import storeSolucionesService from '../services/StoreSolucionesService';
import StoreCaracteristicasService from '../services/StoreCaracteristicasService';

class StoreCaracteristicasController {
    constructor() {}

    /**
     * Crea una nueva característica y la asocia a una solución.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución con la que se asociará la característica.
     * @param {string} req.body.description - Descripción de la característica.
     * @param {string} req.body.titulo - Título de la característica.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async createCaracteristicas(req: Request, res: Response): Promise<void> {
        try {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description, titulo } = req.body;
            
            // Verifica que los datos requeridos estén presentes.
            if (!description || !idSolucion) {
                res.status(401).json({ message: 'Faltan datos de características' });
                return;
            }

            // Llama al servicio para crear la característica y asociarla a la solución.
            const caracteristica = await StoreCaracteristicasService.createCaracteristica({ 
                description, 
                titulo, 
                idSolucion 
            } as any); // Usamos 'as any' temporalmente para evitar el error de tipo

            // Actualiza los campos característicasTitle y característicasPragma en la solución
            const solucion = await storeSolucionesService.getById(idSolucion);
            if (solucion) {
                await storeSolucionesService.update(idSolucion, {
                    caracteristicasTitle: titulo || solucion.caracteristicasTitle,
                    caracteristicasPragma: description || solucion.caracteristicasPragma
                });
            }
            res.status(201).json({ message: 'Característica creada y relacionada con la solución con éxito', caracteristica });
        } catch (error) {
            console.error('Error creando la característica:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Asocia una característica existente a una solución en la base de datos.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {number} req.body.id_solucion - ID de la solución a la que se asociará la característica.
     * @param {number} req.body.id_caracteristica - ID de la característica a asociar.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async asociarCaracteristica(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id_solucion, id_caracteristica } = req.body;
    
            if (!id_solucion) 
            {
                res.status(401).json({ message: 'Faltan datos para la asociación en el id_solucion' });
                return;
            }
            if (!id_caracteristica) 
            {
                res.status(402).json({ message: 'Faltan datos para la asociación en el id_caracteristica' });
                return;
            }
    
            // Llama al servicio para asociar la característica con la solución.
            const asociacion = await StoreCaracteristicasService.asociarCaracteristica(id_solucion, id_caracteristica);
            
            // Obtiene los datos de la característica para actualizar la solución
            const caracteristicas = await StoreCaracteristicasService.getCaracteristicaById(id_caracteristica);
            if (caracteristicas) 
            {
                // Actualiza los campos característicasTitle y característicasPragma en la solución
                const solucion = await storeSolucionesService.getById(id_solucion);
                if (solucion) {
                    await storeSolucionesService.update(id_solucion, 
                    {
                        caracteristicasTitle: caracteristicas.titulo || solucion.caracteristicasTitle,
                        caracteristicasPragma: caracteristicas.description || solucion.caracteristicasPragma
                    });
                }
            }
    
            res.status(201).json({ 
                message: 'Característica asociada a la solución con éxito',
                asociacion
            });
        } 
        catch (error) 
        {
            console.error('Error asociando la característica:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Lista todas las características disponibles en la base de datos.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listCaracteristica(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const listCaracteristica = await StoreCaracteristicasService.listCaracteristicas();

            if (!listCaracteristica.length) 
            {
                res.status(404).json({ message: 'No existen características' });
                return;
            }

            res.status(202).json(listCaracteristica);
        } 
        catch (error) 
        {
            console.error('Error listando las características:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Obtiene las características asociadas a una solución específica.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listIdCaracteristica(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idSolucion } = req.params;
    
            if (!idSolucion) 
            {
                res.status(400).json({ message: 'ID de la solución no proporcionado' });
                return;
            }
    
            const caracteristicaSolucion = await StoreCaracteristicasService.getByIdCaracteristicas(Number(idSolucion));
    
            console.log("Características encontradas:", caracteristicaSolucion);
    
            if (!caracteristicaSolucion || caracteristicaSolucion.length === 0) 
            {
                res.status(404).json({ message: 'No se encontraron características para esta solución' });
                return;
            }
    
            res.status(200).json(caracteristicaSolucion);
        } 
        catch (error) 
        {
            console.error('Error obteniendo las características:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Elimina una característica existente por su ID.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idCaracteristica - ID de la característica a eliminar.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async deleteCaracteristica(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idCaracteristica } = req.params;

            if (!idCaracteristica) 
            {
                res.status(401).json({ message: 'ID no proporcionado' });
                return;
            }
            
            const wasDeleted = await StoreCaracteristicasService.deleteCaracteristica(Number(idCaracteristica));
            
            if (!wasDeleted) 
            {
                res.status(404).json({ message: 'Característica no encontrada o ya eliminada' });
                return;   
            }

            res.status(201).json({ message: 'Característica eliminada correctamente' });
        } 
        catch (error) 
        {
            console.error('Error al eliminar la característica:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    /**
     * Elimina la asociación entre una característica y una solución sin eliminar la característica.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución.
     * @param {string} req.params.idCaracteristica - ID de la característica.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async removeCaracteristicaFromSolucion(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idSolucion, idCaracteristica } = req.params;

            if (!idSolucion || !idCaracteristica) 
            {
                res.status(400).json({ message: 'IDs de solución y característica son requeridos' });
                return;
            }

            await storeSolucionesService.removeCaracteristicaFromSolucion(
                Number(idSolucion), 
                Number(idCaracteristica)
            );

            res.status(200).json({ 
                message: 'Característica desasociada de la solución correctamente' 
            });
        } 
        catch (error) 
        {
            console.error('Error al desasociar la característica de la solución:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default new StoreCaracteristicasController();
