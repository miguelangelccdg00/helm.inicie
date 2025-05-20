import { Request, Response } from 'express';
import storeProblemasService from '../services/StoreProblemasService';
import storeSolucionesService from '../services/StoreSolucionesService';
import { StoreProblemas } from '../../../api-shared-helm/src/models/storeProblemas';
import StoreProblemasService from '../services/StoreProblemasService';

// DTO para crear un problema
interface CreateStoreProblemaDTO
{
  description: string;
  titulo?: string;
  idSolucion: number;
}

interface AsociarSolucionAmbitoProblemaBody 
{
  id_solucion: number;
  id_ambito: number;
  id_problema: number;
}

interface AsociarSolucionAmbitoSectorProblemaBody 
{
  id_solucion: number;
  id_ambito: number;
  id_sector: number;
  id_problema: number;
}

/**
 * Controlador para gestionar los problemas asociados a soluciones.
 */
class StoreProblemasController
{
  /** 
   * Crea un nuevo problema y lo asocia a una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos enviados por el cliente.
   * @param {string} req.body.description - Descripción del problema.
   * @param {string} req.body.titulo - Título del problema (opcional).
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje con los detalles del problema creado si la operación es exitosa.
   * 
   * @throws {400} Si faltan datos en la solicitud o si el ID de la solución es inválido.
   * @throws {500} Error interno del servidor en caso de fallos al crear el problema.
   */
  async createProblema(req: Request, res: Response): Promise<void>
  {
    try
    {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description, titulo } = req.body as { description: string; titulo?: string };

      if (!description || isNaN(idSolucion))
      {
        res.status(400).json({ message: 'Faltan datos del problema o ID inválido' });
        return;
      }

      const problema = await storeProblemasService.createProblema({
        description,
        idSolucion,
        titulo,
      });

      res.status(201).json({
        message: 'Problema creado y relacionado con la solución con éxito',
        problema,
      });
    } catch (error)
    {
      console.error('Error creando el problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Lista todos los problemas.
   * 
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista con todos los problemas.
   * 
   * @throws {500} Error interno del servidor al obtener la lista de problemas.
   */
  async listProblemas(req: Request, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion } = req.params;
      const listProblema: StoreProblemas[] = await storeProblemasService.getProblemas();

      if (!listProblema.length)
      {
        console.info(`ℹ️ No se encontraron beneficios para la solución ${idSolucion}, devolviendo lista vacía.`);
        res.status(200).json([]); // Devolver 200 OK con un array vacío para evitar el error 404
        return;
      }

      res.status(200).json(listProblema);
    } catch (error)
    {
      console.error('Error listando problemas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Lista los problemas asociados a una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el parámetro `idSolucion`.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista de problemas asociados a la solución.
   * 
   * @throws {400} Si el ID de la solución es inválido.
   * @throws {500} Error interno del servidor al obtener los problemas asociados a la solución.
   */
  async listProblemasBySolucion(req: Request, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion } = req.params;

      if (!idSolucion || isNaN(Number(idSolucion)))
      {
        res.status(400).json({ message: 'ID de la solución no válido' });
        return;
      }

      const problemasSolucion: StoreProblemas[] = await storeProblemasService.getByIdProblemas(Number(idSolucion));

      if (!problemasSolucion.length)
      {
        console.info(`ℹ️ No se encontraron problemas para la solución ${idSolucion}, devolviendo lista vacía.`);
        res.status(200).json([]); // Devolver 200 OK con un array vacío para evitar el error 404
        return;
      }

      res.status(200).json(problemasSolucion);
    } catch (error)
    {
      console.error('Error obteniendo problemas por solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Lista todas las características existentes.
   * 
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista de todas las características si es exitosa.
   * 
   * @throws {500} Error interno en el servidor en caso de fallos al obtener las características.
   */
  async listSolucionAmbitoProblema(req: Request, res: Response): Promise<void>
  {
    try
    {
      const listSolucionAmbitoProblema: AsociarSolucionAmbitoProblemaBody[] = await storeProblemasService.listSolucionAmbitoProblema();

      if (!listSolucionAmbitoProblema.length)
      {
        res.status(404).json({ message: 'No existen relaciones de solucion x ambitos x problemas' });
        return;
      }

      res.status(200).json(listSolucionAmbitoProblema);
    } catch (error)
    {
      console.error('Error listando los problemas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Lista todas las características existentes.
   * 
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista de todas las características si es exitosa.
   * 
   * @throws {500} Error interno en el servidor en caso de fallos al obtener las características.
   */
  async listSolucionAmbitoSectorProblema(req: Request, res: Response): Promise<void>
  {
    try
    {
      const listSolucionAmbitoSectorProblema: AsociarSolucionAmbitoSectorProblemaBody[] = await StoreProblemasService.listSolucionAmbitoSectorProblema();

      if (!listSolucionAmbitoSectorProblema.length)
      {
        res.status(404).json({ message: 'No existen relaciones de solucion x ambitos x sector x problemas' });
        return;
      }

      res.status(200).json(listSolucionAmbitoSectorProblema);
    } catch (error)
    {
      console.error('Error listando los problemas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Modifica los datos de un problema existente.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el `id` del problema y los datos a modificar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el resultado de la modificación del problema.
   * 
   * @throws {400} Si no se proporciona un ID válido o si no se enviaron datos para la modificación.
   * @throws {500} Error interno del servidor al modificar el problema.
   */
  async modifyStoreProblemas(req: Request, res: Response): Promise<void>
  {
    try
    {
      const { id } = req.params;
      const updateData = req.body as Partial<StoreProblemas>;

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

      const result = await storeProblemasService.update(Number(id), updateData);
      res.json(result);
    } catch (error)
    {
      console.error('Error modificando storeProblemas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Elimina un problema existente.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el `idProblema` a eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje de éxito si el problema fue eliminado correctamente.
   * 
   * @throws {400} Si el ID proporcionado no es válido.
   * @throws {500} Error interno del servidor al intentar eliminar el problema.
   */
  async deleteProblema(req: Request, res: Response): Promise<void>
  {
    try
    {
      const { idProblema } = req.params;

      if (!idProblema || isNaN(Number(idProblema)))
      {
        res.status(400).json({ message: 'ID no proporcionado o inválido' });
        return;
      }

      const wasDeleted = await storeProblemasService.deleteProblema(Number(idProblema));

      if (!wasDeleted)
      {
        res.status(404).json({ message: 'Problema no encontrado o ya eliminado' });
        return;
      }

      res.status(200).json({ message: 'Problema eliminado correctamente' });
    } catch (error)
    {
      console.error('Error eliminando problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Asocia un problema a una solución existente.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el problema.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje de éxito si el problema se asocia correctamente a la solución.
   * 
   * @throws {401} Si falta el `id_solucion` para la asociación.
   * @throws {402} Si falta el `id_problema` para la asociación.
   * @throws {500} Error interno del servidor al intentar asociar el problema.
   */
  async asociarProblema(req: Request, res: Response): Promise<void>
  {
    try
    {
      const { id_solucion, id_problema } = req.body as { id_solucion: number; id_problema: number };

      if (!id_solucion)
      {
        res.status(401).json({ message: 'Falta el id_solucion para la asociación' });
        return;
      }

      if (!id_problema)
      {
        res.status(402).json({ message: 'Falta el id_problema para la asociación' });
        return;
      }

      const asociacion = await storeProblemasService.asociarProblema(id_solucion, id_problema);

      res.status(201).json({
        message: 'Problema asociado a la solución con éxito',
        asociacion,
      });
    } catch (error)
    {
      console.error('Error asociando problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Asocia un problema con una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de asociación.
   * @param {number} req.body.id_solucion - ID de la solución que se asociará con el problema.
   * @param {number} req.body.id_ambito - ID del problema que se asociará con la solución.
   * @param {number} req.body.id_problema - ID del problema que se asociará con la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la asociación exitosa entre la solución y el problema.
   * 
   * @throws {400} Si faltan datos en la solicitud.
   * @throws {500} Si ocurre un error interno al asociar el problema con la solución.
   */
  async asociarSolucionAmbitoProblema(req: Request<any, any, AsociarSolucionAmbitoProblemaBody>, res: Response): Promise<void> {
    try {
      const { id_solucion, id_ambito, id_problema } = req.body;

      if (!id_solucion || !id_ambito || !id_problema) {
        res.status(400).json({ message: 'Faltan datos para la asociación' });
        return;
      }

      const asociacion = await storeProblemasService.asociarSolucionAmbitoProblema(id_solucion, id_ambito, id_problema);
      const problema = await storeProblemasService.getProblemaById(id_problema);
      const solucion = await storeSolucionesService.getById(id_solucion);

      res.status(201).json({
        message: 'Problema asociado a la solución con éxito',
        asociacion,
        problema
      });
    } catch (error) {
      console.error('Error asociando el problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Asocia un problema con una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de asociación.
   * @param {number} req.body.id_solucion - ID de la solución que se asociará con el problema.
   * @param {number} req.body.id_ambito - ID del problema que se asociará con la solución.
   * @param {number} req.body.id_problema - ID del problema que se asociará con la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la asociación exitosa entre la solución y el problema.
   * 
   * @throws {400} Si faltan datos en la solicitud.
   * @throws {500} Si ocurre un error interno al asociar el problema con la solución.
   */
  async asociarSolucionAmbitoSectorProblemas(req: Request<any, any, AsociarSolucionAmbitoSectorProblemaBody>, res: Response): Promise<void> {
    try {
      const { id_solucion, id_ambito, id_sector, id_problema } = req.body;

      if (!id_solucion || !id_ambito || !id_sector || !id_problema) {
        res.status(400).json({ message: 'Faltan datos para la asociación' });
        return;
      }

      const asociacion = await storeProblemasService.asociarSolucionAmbitoSectorProblema(id_solucion, id_ambito, id_sector, id_problema);
      const problema = await storeProblemasService.getProblemaById(id_problema);
      const solucion = await storeSolucionesService.getById(id_solucion);

      res.status(201).json({
        message: 'Problema asociado a la solución-ambito-sector con éxito',
        asociacion,
        problema
      });
    } catch (error) {
      console.error('Error asociando el problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Desasocia un problema de una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el problema.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje de éxito si el problema se desasocia correctamente de la solución.
   * 
   * @throws {400} Si los IDs de la solución o el problema no son válidos.
   * @throws {500} Error interno del servidor al intentar desasociar el problema.
   */
  async removeProblemaFromSolucion(req: Request, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion, idProblema } = req.params;

      if (!idSolucion || !idProblema)
      {
        res.status(400).json({ message: 'IDs de solución y problema son requeridos' });
        return;
      }

      await storeSolucionesService.removeProblemaFromSolucion(
        Number(idSolucion),
        Number(idProblema)
      );

      res.status(200).json({
        message: 'Problema desasociado de la solución correctamente'
      });
    } catch (error)
    {
      console.error('Error desasociando problema de solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async selectorSolucionAmbitoSectorProblema(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const { idSector } = req.params;

      if (!idSector) 
      {
        res.status(401).json({ message: 'Faltan datos para la asociación en el id_sector' });
        return;
      }

      const selectorProblema = await storeProblemasService.selectorSolucionAmbitoSectorProblema(Number(idSector));

      res.status(201).json({
        message: 'Selector de problema con éxito',
        selectorProblema
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
