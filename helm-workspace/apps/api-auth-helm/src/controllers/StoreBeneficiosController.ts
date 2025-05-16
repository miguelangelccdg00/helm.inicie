import { Request, Response } from 'express'; 
import storeBeneficiosService from '../services/StoreBeneficiosService';
import storeSolucionesService from '../services/StoreSolucionesService';
import { StoreBeneficios } from '../../../api-shared-helm/src/models/storeBeneficios';

// DTO para crear beneficio
interface CreateStoreBeneficioDTO 
{
  description: string;
  idSolucion: number;
}

interface AsociarSolucionAmbitoBeneficioBody 
{
  id_solucion: number;
  id_ambito: number;
  id_beneficio: number;
}

interface AsociarSolucionAmbitoSectorBeneficioBody 
{
  id_solucion: number;
  id_ambito: number;
  id_sector: number;
  id_beneficio: number;
}

/**
 * Controlador para gestionar los beneficios asociados a soluciones.
 */
class StoreBeneficiosControllers 
{
  /**
   * Crea un beneficio y lo asocia a una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos del beneficio a crear.
   * @param {string} req.body.description - Descripción del beneficio que se va a crear.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el beneficio creado y asociado a la solución.
   * 
   * @throws {400} Si faltan datos o el ID de solución es inválido.
   * @throws {500} Error interno del servidor en caso de fallos durante la creación.
   */
  async createBeneficio(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description } = req.body as { description: string };

      if (!description || isNaN(idSolucion)) 
      {
        res.status(400).json({ message: 'Faltan datos del beneficio o ID inválido' });
        return;
      }

      const beneficio = await storeBeneficiosService.createBeneficio({
        description,
        idSolucion
      } as CreateStoreBeneficioDTO);

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

  /**
   * Asocia un caracteristica con una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de asociación.
   * @param {number} req.body.id_solucion - ID de la solución que se asociará con el caracteristica.
   * @param {number} req.body.id_ambito - ID del caracteristica que se asociará con la solución.
   * @param {number} req.body.id_beneficio - ID del caracteristica que se asociará con la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la asociación exitosa entre la solución y el caracteristica.
   * 
   * @throws {400} Si faltan datos en la solicitud.
   * @throws {500} Si ocurre un error interno al asociar el caracteristica con la solución.
   */
  async asociarSolucionAmbitoBeneficio(req: Request<any, any, AsociarSolucionAmbitoBeneficioBody>, res: Response): Promise<void> {
    try {
      const { id_solucion, id_ambito, id_beneficio } = req.body;

      if (!id_solucion || !id_ambito || !id_beneficio) {
        res.status(400).json({ message: 'Faltan datos para la asociación' });
        return;
      }

      const asociacion = await storeBeneficiosService.asociarSolucionAmbitoBeneficio(id_solucion, id_ambito, id_beneficio);
      const beneficio = await storeBeneficiosService.getByIdBeneficio(id_beneficio);
      const solucion = await storeSolucionesService.getById(id_solucion);

      res.status(201).json({
        message: 'Beneficio asociado a la solución-ambito con éxito',
        asociacion,
        beneficio
      });
    } catch (error) {
      console.error('Error asociando el beneficio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Asocia un caracteristica con una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos de asociación.
   * @param {number} req.body.id_solucion - ID de la solución que se asociará con el caracteristica.
   * @param {number} req.body.id_ambito - ID del caracteristica que se asociará con la solución.
   * @param {number} req.body.id_beneficio - ID del caracteristica que se asociará con la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve la asociación exitosa entre la solución y el caracteristica.
   * 
   * @throws {400} Si faltan datos en la solicitud.
   * @throws {500} Si ocurre un error interno al asociar el caracteristica con la solución.
   */
  async asociarSolucionAmbitoSectorBeneficios(req: Request<any, any, AsociarSolucionAmbitoSectorBeneficioBody>, res: Response): Promise<void> {
    try {
      const { id_solucion, id_ambito, id_sector, id_beneficio } = req.body;

      if (!id_solucion || !id_ambito || !id_sector || !id_beneficio) {
        res.status(400).json({ message: 'Faltan datos para la asociación' });
        return;
      }

      const asociacion = await storeBeneficiosService.asociarSolucionAmbitoSectorBeneficio(id_solucion, id_ambito, id_sector, id_beneficio);
      const beneficio = await storeBeneficiosService.getByIdBeneficio(id_beneficio);
      const solucion = await storeSolucionesService.getById(id_solucion);

      res.status(201).json({
        message: 'Beneficio asociado a la solución-ambito-sector con éxito',
        asociacion,
        beneficio
      });
    } catch (error) {
      console.error('Error asociando el beneficio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
  /**
   * Lista los beneficios asociados a una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID de la solución.
   * @param {string} req.params.idSolucion - ID de la solución de la cual obtener los beneficios.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista de los beneficios asociados a la solución solicitada.
   * 
   * @throws {400} Si el ID de la solución no es válido.
   * @throws {500} Error interno del servidor en caso de fallos al obtener los beneficios.
   */
  async listBeneficios(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const { idSolucion } = req.params;

      if (!idSolucion || isNaN(Number(idSolucion))) 
      {
        res.status(400).json({ message: 'ID de la solución no válido' });
        return;
      }

      const beneficiosSolucion: StoreBeneficios[] = await storeBeneficiosService.getByIdBeneficio(Number(idSolucion));

      if (!beneficiosSolucion.length) 
      {
        console.info(`ℹ️ No se encontraron beneficios para la solución ${idSolucion}, devolviendo lista vacía.`);
        res.status(200).json([]); // Devolver 200 OK con un array vacío para evitar el error 404
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

  /**
   * Lista todos los beneficios existentes en el sistema.
   * 
   * @param {Request} req - Objeto de solicitud HTTP para obtener los beneficios.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista de todos los beneficios.
   * 
   * @throws {500} Error interno del servidor en caso de fallos al obtener los beneficios.
   */
  async listCompleteBeneficios(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const listBeneficio: StoreBeneficios[] = await storeBeneficiosService.getBeneficio();

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
  async listSolucionAmbitoBeneficio(req: Request, res: Response): Promise<void>
  {
    try
    {
      const listSolucionAmbitoBeneficio: AsociarSolucionAmbitoBeneficioBody[] = await storeBeneficiosService.listSolucionAmbitoBeneficio();

      if (!listSolucionAmbitoBeneficio.length)
      {
        res.status(404).json({ message: 'No existen relaciones de solucion x ambitos x beneficios' });
        return;
      }

      res.status(200).json(listSolucionAmbitoBeneficio);
    } catch (error)
    {
      console.error('Error listando los beneficios:', error);
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
  async listSolucionAmbitoSectorBeneficio(req: Request, res: Response): Promise<void>
  {
    try
    {
      const listSolucionAmbitoSectorBeneficio: AsociarSolucionAmbitoSectorBeneficioBody[] = await storeBeneficiosService.listSolucionAmbitoSectorBeneficio();

      if (!listSolucionAmbitoSectorBeneficio.length)
      {
        res.status(404).json({ message: 'No existen relaciones de solucion x ambitos x sector x beneficios' });
        return;
      }

      res.status(200).json(listSolucionAmbitoSectorBeneficio);
    } catch (error)
    {
      console.error('Error listando los beneficios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /**
   * Modifica los datos de un beneficio existente.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos para modificar el beneficio.
   * @param {string} req.params.id - ID del beneficio que se desea modificar.
   * @param {Partial<StoreBeneficios>} req.body - Datos que se desean actualizar en el beneficio.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el beneficio actualizado.
   * 
   * @throws {400} Si el ID del beneficio no es proporcionado o los datos son incorrectos.
   * @throws {500} Error interno del servidor en caso de fallos al modificar el beneficio.
   */
  async modifyStoreBeneficios(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const { id } = req.params;
      const updateData = req.body as Partial<StoreBeneficios>;

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

      const result = await storeBeneficiosService.update(Number(id), updateData);
      res.json(result);
    } 
    catch (error) 
    {
      console.error('Error al modificar storeSoluciones:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  /**
   * Elimina un beneficio del sistema.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID del beneficio a eliminar.
   * @param {string} req.params.idBeneficio - ID del beneficio a eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje indicando si el beneficio fue eliminado correctamente.
   * 
   * @throws {400} Si el ID del beneficio no es proporcionado o es inválido.
   * @throws {500} Error interno del servidor en caso de fallos al eliminar el beneficio.
   */
  async deleteBeneficio(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const { idBeneficio } = req.params;

      if (!idBeneficio || isNaN(Number(idBeneficio))) 
      {
        res.status(400).json({ message: 'ID no proporcionado o inválido' });
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

  /**
   * Asocia un beneficio a una solución existente.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos para asociar el beneficio.
   * @param {number} req.body.id_solucion - ID de la solución a la que se asociará el beneficio.
   * @param {number} req.body.id_beneficio - ID del beneficio que se asociará.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar la respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje indicando si la asociación fue exitosa.
   * 
   * @throws {401} Si falta el ID de solución.
   * @throws {402} Si falta el ID de beneficio.
   * @throws {500} Error interno del servidor en caso de fallos durante la asociación.
   */
  async asociarBeneficio(req: Request, res: Response): Promise<void> 
  {
    try 
    {
      const { id_solucion, id_beneficio } = req.body as { id_solucion: number; id_beneficio: number };

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
