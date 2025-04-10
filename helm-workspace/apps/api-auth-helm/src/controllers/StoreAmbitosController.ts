import { Request, Response } from 'express';
import StoreAmbitosService from '../services/StoreAmbitosService';
import storeSolucionesService from '../services/StoreSolucionesService';

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

    async asociarAmbito(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id_solucion, id_ambito } = req.body;

            if (!id_solucion || !id_ambito) 
            {
                res.status(400).json({ message: 'Faltan datos para la asociación' });
                return;
            }

            const asociacion = await StoreAmbitosService.asociarAmbito(id_solucion, id_ambito);

            const ambito = await StoreAmbitosService.getAmbitoById(id_ambito);
            const solucion = await storeSolucionesService.getById(id_solucion);

            res.status(201).json(
            {
                message: 'Ámbito asociado a la solución con éxito',
                asociacion
            });
        } 
        catch (error) 
        {
            console.error('Error asociando el ámbito:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    

    /**
     * Lista todas las características disponibles en la base de datos.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listAmbitos(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const listAmbitos = await StoreAmbitosService.listAmbitos();

            if (!listAmbitos.length) 
            {
                res.status(404).json({ message: 'No existen ambitos' });
                return;
            }

            res.status(202).json(listAmbitos);
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
    async listIdAmbito(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { idSolucion } = req.params;
    
            if (!idSolucion) 
            {
                res.status(400).json({ message: 'ID de la solución no proporcionado' });
                return;
            }
    
            const ambitoSolucion = await StoreAmbitosService.getByIdAmbitos(Number(idSolucion));
    
            console.log("Ambitos encontrados:", ambitoSolucion);
    
            if (!ambitoSolucion || ambitoSolucion.length === 0) 
            {
                res.status(404).json({ message: 'No se encontraron ambitos para esta solución' });
                return;
            }
    
            res.status(200).json(ambitoSolucion);
        } 
        catch (error) 
        {
            console.error('Error obteniendo los ambitos:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default new StoreAmbitosController();
