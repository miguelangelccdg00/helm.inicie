import { Request, Response } from 'express';
import StoreAmbitosService from '../services/StoreAmbitosService';
import storeSolucionesService from '../services/StoreSolucionesService';
import { StoreAmbitos } from '../../../api-shared-helm/src/models/storeAmbitos';
import { SolucionAmbito } from '@modelos-shared/solucionAmbito';

interface CreateAmbitoBody extends Omit<StoreAmbitos, 'id_ambito'> {}

interface AsociarAmbitoBody 
{
  id_solucion: number;
  id_ambito: number;
}

class StoreAmbitosController 
{

  /**
   * Crea un nuevo ámbito y lo guarda en la base de datos.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos enviados por el cliente.
   * @param {string} req.body.description - Descripción del ámbito que se desea crear.
   * @param {string} req.body.textoweb - Texto para la página web asociado al ámbito.
   * @param {string} req.body.prefijo - Prefijo del ámbito.
   * @param {string} req.body.slug - Slug (URL amigable) del ámbito.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el ámbito creado si la operación es exitosa.
   * 
   * @throws {400} Si faltan datos o los datos son inválidos, devuelve un error con un mensaje adecuado.
   * @throws {500} Si ocurre un error interno en el servidor al crear el ámbito.
   */
  async createAmbitosSolucion(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const { description, textoweb, prefijo, slug } = req.body;
  
      if (!description || !textoweb || !prefijo || !slug) 
      {
        res.status(400).json({ message: 'Datos incompletos o mal formateados' });
        return;
      }
  
      const resultado = await StoreAmbitosService.createAmbitoSolucion({ description, textoweb, prefijo, slug });
  
      if (!resultado?.id_ambito) 
      {
        res.status(500).json({ message: 'No se pudo crear el ámbito' });
        return;
      }
  
      const ambitoCreado = await StoreAmbitosService.getAmbitoById(resultado.id_ambito);
      res.status(201).json({ ...resultado, ambito: ambitoCreado });
  
    } 
    catch (error) 
    {
      console.error('🔴 Error en createAmbitos:', 
      {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
  
      res.status(500).json({ message: 'Error interno del servidor al crear el ámbito.' });
    }
  }

  /**
   * Crea un nuevo ámbito por una solucion determinado.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos enviados por el cliente.
   * @param {string} req.body.description - Descripción del ámbito que se desea crear.
   * @param {string} req.body.textoweb - Texto para la página web asociado al ámbito.
   * @param {string} req.body.prefijo - Prefijo del ámbito.
   * @param {string} req.body.slug - Slug (URL amigable) del ámbito.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el ámbito creado si la operación es exitosa.
   * 
   * @throws {400} Si faltan datos o los datos son inválidos, devuelve un error con un mensaje adecuado.
   * @throws {500} Si ocurre un error interno en el servidor al crear el ámbito.
   */
  async createAmbitos(req: Request<{idSolucion: string}>, res: Response): Promise<void> 
  {
    try 
    {
      const idSolucion = parseInt(req.params.idSolucion, 10);

      const { description, textoweb, prefijo, slug } = req.body;

      if (isNaN(idSolucion)) {
        res.status(400).json({ message: 'ID de solución no es válido.' });
        return;
      }
  
      if (!description || !textoweb || !prefijo || !slug) 
      {
        res.status(400).json({ message: 'Datos incompletos o mal formateados' });
        return;
      }
  
      const resultado = await StoreAmbitosService.createAmbito({ idSolucion, description, textoweb, prefijo, slug });
  
      if (!resultado?.id_ambito) 
      {
        res.status(500).json({ message: 'No se pudo crear el ámbito' });
        return;
      }
  
      const ambitoCreado = await StoreAmbitosService.getAmbitoById(resultado.id_ambito);
      res.status(201).json({ ...resultado, ambito: ambitoCreado });
  
    } 
    catch (error) 
    {
      console.error('🔴 Error en createAmbitos:', 
      {
        message: (error as Error).message,
        stack: (error as Error).stack
      });
  
      res.status(500).json({ message: 'Error interno del servidor al crear el ámbito.' });
    }
  }
  
  
  /**
   * Crea un nuevo ámbito en la base de datos de una tienda.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos enviados por el cliente.
   * @param {string} req.body.description - Descripción del ámbito que se desea crear.
   * @param {string} req.body.textoweb - Texto para la página web asociado al ámbito.
   * @param {string} req.body.prefijo - Prefijo del ámbito.
   * @param {string} req.body.slug - Slug (URL amigable) del ámbito.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el ámbito creado si la operación es exitosa.
   * 
   * @throws {400} Si faltan datos para crear el ámbito.
   * @throws {500} Si ocurre un error interno al intentar crear el ámbito.
   */
  async createStoreAmbitos(req: Request, res: Response): Promise<void>
  {
    try 
    {
      const { description, textoweb, prefijo, slug } = req.body;
  
      if (!description || !textoweb || !prefijo || !slug) 
      {
        res.status(400).json({ message: 'Faltan datos requeridos para crear el ámbito.' });
        return;
      }
  
      const resultado = await StoreAmbitosService.createStoreAmbito({
        description,
        textoweb,
        prefijo,
        slug
      });
  
      const ambitoCreado = await StoreAmbitosService.getAmbitoById(resultado.id_ambito);
  
      res.status(201).json({
        ...resultado,
        ambito: ambitoCreado
      });
    } 
    catch (error) 
    {
      console.error('Error en createAmbitos:', error);
      res.status(500).json({ message: 'Error interno del servidor al crear el ámbito.' });
    }
  }
  
  /**
   * Asocia un ámbito con una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de asociación.
   * @param {number} req.body.id_solucion - ID de la solución que se asociará con el ámbito.
   * @param {number} req.body.id_ambito - ID del ámbito que se asociará con la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la asociación exitosa entre la solución y el ámbito.
   * 
   * @throws {400} Si faltan datos en la solicitud.
   * @throws {500} Si ocurre un error interno al asociar el ámbito con la solución.
   */
  async asociarAmbito(req: Request<any, any, AsociarAmbitoBody>, res: Response): Promise<void> {
    try {
      const { id_solucion, id_ambito } = req.body;

      if (!id_solucion || !id_ambito) {
        res.status(400).json({ message: 'Faltan datos para la asociación' });
        return;
      }

      const asociacion = await StoreAmbitosService.asociarAmbito(id_solucion, id_ambito);
      const ambito = await StoreAmbitosService.getAmbitoById(id_ambito);
      const solucion = await storeSolucionesService.getById(id_solucion);
      const ambitosActualizados = await StoreAmbitosService.getByIdAmbitos(id_solucion);

      res.status(201).json({
        message: 'Ámbito asociado a la solución con éxito',
        asociacion,
        ambito,
        ambitosActualizados
      });
    } catch (error) {
      console.error('Error asociando el ámbito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene una lista de todos los ámbitos existentes.
   * 
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la lista de todos los ámbitos disponibles.
   * 
   * @throws {500} Si ocurre un error interno al listar los ámbitos.
   */
  async listAmbitos(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const listAmbitos: StoreAmbitos[] = await StoreAmbitosService.listAmbitos();

      if (!listAmbitos.length) 
        {
        res.status(404).json({ message: 'No existen ambitos' });
        return;
      }

      res.status(202).json(listAmbitos);
    } 
    catch (error) 
    {
      console.error('Error listando los ambitos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Obtiene los ámbitos asociados a una solución específica identificada por su ID.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID de la solución.
   * @param {string} req.params.idSolucion - ID de la solución cuya lista de ámbitos se desea obtener.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la lista de ámbitos asociados a la solución especificada.
   * 
   * @throws {400} Si el ID de la solución no es proporcionado.
   * @throws {500} Si ocurre un error interno al obtener los ámbitos para la solución.
   */
  async listIdAmbito(req: Request<{ idSolucion: string }>, res: Response): Promise<void> {
    try {
      const { idSolucion } = req.params;

      if (!idSolucion) {
        res.status(400).json({ message: 'ID de la solución no proporcionado' });
        return;
      }

      const ambitoSolucion: StoreAmbitos[] = await StoreAmbitosService.getByIdAmbitos(Number(idSolucion));

      if (!ambitoSolucion || ambitoSolucion.length === 0) {
        console.info(`ℹ️ No se encontraron ámbitos para la solución ${idSolucion}, devolviendo lista vacía.`);
        res.status(200).json([]); // Devolver 200 OK con un array vacío para evitar el error 404
        return;
      }

      res.status(200).json(ambitoSolucion);
    } catch (error) {
      console.error('Error obteniendo los ambitos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Modifica los detalles de un ámbito asociado a una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de actualización.
   * @param {string} req.params.idSolucion - ID de la solución asociada al ámbito que se desea modificar.
   * @param {string} req.params.idAmbito - ID del ámbito que se desea modificar.
   * @param {Partial<StoreAmbitos>} req.body - Datos de actualización para el ámbito.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve los detalles del ámbito actualizado.
   * 
   * @throws {400} Si el ID de la solución o el ID del ámbito no se proporcionan correctamente.
   * @throws {500} Si ocurre un error interno al modificar los detalles del ámbito.
   */
  async modifyStoreAmbitos(req: Request<{ idSolucion: string; idAmbito: string }, any, Partial<StoreAmbitos>>, res: Response): Promise<void> {
    try {
      const { idSolucion, idAmbito } = req.params;
      const updateData = req.body;

      if (!idSolucion) {
        res.status(400).json({ message: 'ID de solucion no proporcionado' });
        return;
      }

      if (!idAmbito) {
        res.status(400).json({ message: 'ID de ambito no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length) {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await StoreAmbitosService.update(Number(idAmbito), Number(idSolucion), updateData);
      res.json(result);
    } catch (error) {
      console.error('Error al modificar storeAmbitos:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  /**
   * Modifica los detalles de un ámbito en la base de datos.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de actualización.
   * @param {string} req.params.idAmbito - ID del ámbito que se desea modificar.
   * @param {Partial<StoreAmbitos>} req.body - Datos de actualización para el ámbito.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve los detalles del ámbito actualizado.
   * 
   * @throws {400} Si el ID del ámbito no se proporciona correctamente.
   * @throws {500} Si ocurre un error interno al modificar el ámbito.
   */
  async modifyAmbitos(req: Request<{idAmbito: string }, any, Partial<StoreAmbitos>>, res: Response): Promise<void> 
  {
    try 
    {
      const { idAmbito } = req.params;
      const updateData = req.body;

      if (!idAmbito) 
      {
        res.status(400).json({ message: 'ID de ambito no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length) 
      {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await StoreAmbitosService.updateAmbito(Number(idAmbito), updateData);
      res.json(result);
    } 
    catch (error) 
    {
      console.error('Error al modificar storeAmbitos:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  /**
   * Modifica la relación de un ámbito con una solución, actualizando los datos asociados.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de actualización.
   * @param {string} req.params.idSolucion - ID de la solución cuya relación con el ámbito se desea modificar.
   * @param {SolucionAmbito} req.body - Datos de la relación entre la solución y el ámbito.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve los detalles de la relación actualizada entre la solución y el ámbito.
   * 
   * @throws {400} Si el ID de la solución no se proporciona o los datos de la relación no se proporcionan correctamente.
   * @throws {500} Si ocurre un error interno al modificar la relación del ámbito con la solución.
   */
  async modifySolucionAmbitos(req: Request<{ idSolucion: string }, any, SolucionAmbito>, res: Response): Promise<void> 
  {
    try 
    {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const solucionAmbito = req.body;

      if (!idSolucion) 
      {
        res.status(400).json({ message: 'ID de solución no proporcionado' });
        return;
      }

      if (!solucionAmbito) 
      {
        res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        return;
      }

      const result = await StoreAmbitosService.updateSolucionAmbitos(
        idSolucion, 
        solucionAmbito
      );

      res.status(200).json({
        message: 'Ambito de solución actualizado correctamente',
        data: result
      });
    } 
    catch (error) 
    {
      console.error('❌ Error al modificar ambito de solución:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor al modificar el ambito de solución' 
      });
    }
  }

  /**
   * Elimina un ámbito de la base de datos.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID del ámbito a eliminar.
   * @param {string} req.params.idAmbito - ID del ámbito que se desea eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje de éxito si el ámbito se eliminó correctamente.
   * 
   * @throws {400} Si el ID del ámbito no se proporciona correctamente.
   * @throws {500} Si ocurre un error interno al intentar eliminar el ámbito.
   */
  async deleteAmbito(req: Request<{ idAmbito: string }>, res: Response): Promise<void> {
    try {
      const { idAmbito } = req.params;

      if (!idAmbito) {
        res.status(401).json({ message: 'ID no proporcionado' });
        return;
      }

      const wasDeleted = await StoreAmbitosService.deleteAmbito(Number(idAmbito));

      if (!wasDeleted) {
        res.status(404).json({ message: 'Ambito no encontrado o ya eliminado' });
        return;
      }

      res.status(201).json({ message: 'Ambito eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el ambito:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Elimina la relación de un ámbito con una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el ámbito a desasociar.
   * @param {string} req.params.idSolucion - ID de la solución de la que se desasociará el ámbito.
   * @param {string} req.params.idAmbito - ID del ámbito que se desasociará de la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje de éxito si la relación se desasocia correctamente.
   * 
   * @throws {400} Si los IDs de la solución o el ámbito no se proporcionan correctamente.
   * @throws {500} Si ocurre un error interno al desasociar el ámbito de la solución.
   */
  async removeAmbitoFromSolucion(req: Request<{ idSolucion: string; idAmbito: string }>, res: Response): Promise<void> {
    try {
      const { idSolucion, idAmbito } = req.params;

      if (!idSolucion || !idAmbito) {
        res.status(400).json({ message: 'IDs de solución y ambito son requeridos' });
        return;
      }

      await storeSolucionesService.removeAmbitoFromSolucion(Number(idSolucion), Number(idAmbito));

      res.status(200).json({
        message: 'Ambito desasociada de la solución correctamente'
      });
    } catch (error) {
      console.error('Error al desasociar la ambito de la solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new StoreAmbitosController();
