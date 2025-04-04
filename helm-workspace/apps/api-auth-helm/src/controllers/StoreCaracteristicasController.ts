import { Request, Response } from 'express';
import storeSolucionesService from '../services/StoreSolucionesService';
import StoreCaracteristicasService from '../services/StoreCaracteristicasService';

class StoreCaracteristicasController
{
    constructor(){}

    /**
     * Crea un nuevo caracteristica y lo asocia a una solución.
     */
    async createCaracteristicas(req: Request, res: Response): Promise<void>
    {
        try 
        {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description, titulo } = req.body;
            
            // Verifica que los datos requeridos estén presentes.
            if (!description || !idSolucion) 
            {
                res.status(401).json({ message: 'Faltan datos de caracteristicas' });
                return;
            }

            // Llama al servicio para crear el caracteristica y asociarlo a la solución.
            const caracteristica = await StoreCaracteristicasService.createCaracteristica({ 
                description, 
                titulo, 
                idSolucion 
            } as any); // Usamos 'as any' temporalmente para evitar el error de tipo

            // Actualiza los campos caracteristicasTitle y caracteristicasPragma en la solución
            const solucion = await storeSolucionesService.getById(idSolucion);
            if (solucion) 
            {
                await storeSolucionesService.update(idSolucion, {
                    caracteristicasTitle: titulo || solucion.caracteristicasTitle,
                    caracteristicasPragma: description || solucion.caracteristicasPragma
                });
            }
            res.status(201).json({ message: 'Caracteristica creada y relacionado con la solución con éxito', caracteristica });
        } 
        catch (error)
        {
            console.error('Error creando la caracteristica:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Asocia un caracteristica existente a una solución en la base de datos.
     */
    async asociarCaracteristica(req: Request, res: Response) 
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
    
            // Llama al servicio para asociar el caracteristica con la solución.
            const asociacion = await StoreCaracteristicasService.asociarCaracteristica(id_solucion, id_caracteristica);
            
            // Obtiene los datos del caracteristica para actualizar la solución
            const caracteristicas = await StoreCaracteristicasService.getCaracteristicaById(id_caracteristica);
            if (caracteristicas)
            {
                // Actualiza los campos caracteristicasTitle y caracteristicasPragma en la solución
                const solucion = await storeSolucionesService.getById(id_solucion);
                if (solucion) 
                {
                    await storeSolucionesService.update(id_solucion, {
                        caracteristicasTitle: caracteristicas.titulo || solucion.caracteristicasTitle,
                        caracteristicasPragma: caracteristicas.description || solucion.caracteristicasPragma
                    });
                }
            }
    
            res.status(201).json({ 
                message: 'caracteristicas asociado a la solución con éxito',
                asociacion
            });
        } 
        catch (error)
        {
            console.error('Error asociando a la caracteristica:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Lista todos los caracteristicas disponibles en la base de datos.
     */
    async listCaracteristica(req: Request, res: Response): Promise<void>
    {
        try 
        {
            const listCaracteristica = await StoreCaracteristicasService.listCaracteristicas();

            if (!listCaracteristica.length) 
            {
                res.status(404).json({ message: 'No existen caracteristicas' });
                return;
            }

            res.status(202).json(listCaracteristica);
        } 
        catch (error)
        {
            console.error('Error listando los caracteristicas:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Obtiene los problemas asociados a una solución específica.
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
    
            if (!caracteristicaSolucion || caracteristicaSolucion.length === 0) {
                res.status(404).json({ message: 'No se encontraron caracteristicas para esta solución' });
                return;
            }
    
            res.status(200).json(caracteristicaSolucion);
        } 
        catch (error) 
        {
            console.error('Error obteniendo los problemas:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async deleteCaracteristica(req:Request, res: Response): Promise<void>
    {
        try 
        {
            const { idCaracteristica } = req.params;

            if(!idCaracteristica)
            {
                res.status(401).json({message: 'ID no proporcionado' });
                return;
            }
            
            const wasDeleted = await StoreCaracteristicasService.deleteCaracteristica(Number(idCaracteristica));
            
            if (!wasDeleted) 
            {
                res.status(404).json({ message: 'Caracteristica no encontrado o ya eliminado' });
                return;   
            }

            res.status(201).json({ message: 'Caracteristica eliminado correctamente' })

        }   
        catch (error) 
        {
            console.error('Error al eliminar la caracteristica:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    /**
     * Elimina la asociación entre una caracteristica y una solución sin eliminar la caracteristica.
     */
    async removeCaracteristicaFromSolucion(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idSolucion, idCaracteristica } = req.params;

            if (!idSolucion || !idCaracteristica) 
            {
                res.status(400).json({ message: 'IDs de solución y caracteristica son requeridos' });
                return;
            }

            await storeSolucionesService.removeCaracteristicaFromSolucion(
                Number(idSolucion), 
                Number(idCaracteristica)
            );

            res.status(200).json({ 
                message: 'Caracteristica desasociado de la solución correctamente' 
            });
        } 
        catch (error) 
        {
            console.error('Error al desasociar el caracteristica de la solución:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
 
}

export default new StoreCaracteristicasController();