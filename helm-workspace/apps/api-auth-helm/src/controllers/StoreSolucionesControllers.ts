import { Request, Response } from 'express';
import StoreSolucionesService from '../services/StoreSolucionesService';

class StoreSolucionesController 
{
    /**
     * Obtiene todas las soluciones almacenadas en la base de datos.
     * 
     * @param {Request} req - Objeto de solicitud HTTP. Este parámetro no se usa en este método.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Devuelve un arreglo de soluciones almacenadas en la base de datos.
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
     * 
     * @param {Request} req - Objeto de solicitud HTTP que contiene el parámetro `id` en los parámetros de la URL.
     * @param {string} req.params.id - El ID de la solución que se desea obtener.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Devuelve la solución encontrada o un mensaje de error si no se encuentra.
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
     * 
     * @param {Request} req - Objeto de solicitud HTTP que contiene el parámetro `id` en los parámetros de la URL y los datos a modificar en el cuerpo de la solicitud.
     * @param {string} req.params.id - El ID de la solución que se desea modificar.
     * @param {Object} req.body - El objeto que contiene los datos para actualizar la solución.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Devuelve el resultado de la actualización de la solución.
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

    /**
     * Elimina una solución de la base de datos por su ID.
     * 
     * @param {Request} req - Objeto de solicitud HTTP que contiene el parámetro `id` en los parámetros de la URL.
     * @param {string} req.params.id - El ID de la solución que se desea eliminar.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Devuelve el resultado de la eliminación de la solución.
     */
    async deleteSolucion(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id } = req.params;

            if (!id) 
            {
                res.status(400).json({ message: 'ID no proporcionado' });
                return;
            }

            const deleteSoluciones = await StoreSolucionesService.deleteSolucion(Number(id));

            if (!deleteSoluciones) 
            {
                res.status(404).json({ message: 'Solución no encontrada' });
                return;
            }

            res.json(deleteSoluciones);
        } 
        catch (error)
        {
            console.error('Error al eliminar deleteSolucion:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }


    /**
     * Actualiza los ámbitos de una solución específica.
     * 
     * @param {Request} req - Objeto de solicitud HTTP que contiene el parámetro `id` en los parámetros de la URL y los datos de ámbitos a actualizar en el cuerpo.
     * @param {string} req.params.id - El ID de la solución cuyos ámbitos se desean actualizar.
     * @param {Array} req.body - Array de objetos con los datos de ámbitos a actualizar.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Devuelve el resultado de la actualización de los ámbitos de la solución.
     */
    async updateSolucionAmbitos(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { id } = req.params;
            const solucionAmbitos = req.body;

            if (!id) 
            {
                res.status(400).json({ message: 'ID de solución no proporcionado' });
                return;
            }

            if (!Array.isArray(solucionAmbitos) || solucionAmbitos.length === 0) 
            {
                res.status(400).json({ message: 'Se requiere un array de ámbitos para actualizar' });
                return;
            }

            // Verificar si la solución existe
            const exists = await StoreSolucionesService.checkSolucionExists(Number(id));
            if (!exists) 
            {
                res.status(404).json({ message: 'Solución no encontrada' });
                return;
            }

            const result = await StoreSolucionesService.updateSolucionAmbitos(Number(id), solucionAmbitos);
            res.json(result);
        } 
        catch (error) 
        {
            console.error('Error al actualizar ámbitos de la solución:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new StoreSolucionesController();
