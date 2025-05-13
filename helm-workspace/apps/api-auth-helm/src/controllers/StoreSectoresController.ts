import { Request, Response } from 'express';
import StoreSectoresService from '../services/StoreSectoresService';
import StoreSolucionesService from '../services/StoreSolucionesService';
import { StoreSectores, SolucionSector } from '../../../api-shared-helm/src/models/storeSectores';
import {  SolucionAmbitoSector } from '../../../api-shared-helm/src/models/solucionAmbitoSector';

interface CreateSectorBody extends Omit<StoreSectores, 'id_sector'> {}

interface AsociarSectorBody
{
  id_solucion: number;
  id_sector: number;
}

class storeSectoresControllers
{
  /** 
   * Crea un nuevo sector y lo asocia a una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos del sector a crear.
   * @param {CreateSectorBody} req.body - Datos del nuevo sector.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el sector recién creado.
   * 
   * @throws {400} Si faltan datos requeridos en la solicitud.
   * @throws {500} Error interno del servidor si ocurre un fallo al crear el sector.
   */
  async createSectores(req: Request<{ idSolucion: string }, any, CreateSectorBody>, res: Response): Promise<void>
  {
    try
    {
      const { description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage } = req.body;

      if (!description || !textoweb || !prefijo || !slug || !descriptionweb || !titleweb || !backgroundImage)
      {
        res.status(400).json({ message: 'Faltan datos requeridos para crear el sector.' });
        return;
      }

      const resultado = await StoreSectoresService.createSector({
        description,
        textoweb,
        prefijo,
        slug,
        descriptionweb,
        titleweb,
        backgroundImage,
      });

      const sectorCreado = await StoreSectoresService.getSectorById(resultado.id_sector);

      res.status(201).json({
        ...resultado,
        sector: sectorCreado,
      });
    }
    catch (error)
    {
      console.warn('⚠️ Error en createSectores:', error);
      res.status(500).json({ message: 'Error interno del servidor al crear el sector.' });
    }
  }

  /** 
   * Crea un nuevo sector sin asociarlo directamente a una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los datos del sector.
   * @param {CreateSectorBody} req.body - Datos del sector a crear.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el sector recién creado.
   * 
   * @throws {500} Error interno del servidor si ocurre un fallo al crear el sector.
   */
  async createStoreSectores(req: Request<CreateSectorBody>, res: Response): Promise<void>
  {
    try
    {
      const { description, textoweb, prefijo, slug, descriptionweb, titleweb, backgroundImage } = req.body;

      const resultado = await StoreSectoresService.createStoreSector({
        description,
        textoweb,
        prefijo,
        slug,
        descriptionweb,
        titleweb,
        backgroundImage,
      });

      const sectorCreado = await StoreSectoresService.getSectorById(resultado.id_sector);

      res.status(201).json({
        ...resultado,
        sector: sectorCreado,
      });
    }
    catch (error)
    {
      console.warn('⚠️ Error en createStoreSectores:', error);
      res.status(500).json({ message: 'Error interno del servidor al crear el sector.' });
    }
  }

  /** 
   * Asocia un sector a una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs del sector y la solución.
   * @param {AsociarSectorBody} req.body - Datos para asociar el sector a la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje con los detalles de la asociación.
   * 
   * @throws {400} Si faltan datos para la asociación.
   * @throws {500} Error interno del servidor al asociar el sector.
   */
  async asociarSector(req: Request<any, any, AsociarSectorBody>, res: Response): Promise<void>
  {
    try
    {
      const { id_solucion, id_sector } = req.body;

      if (!id_solucion || !id_sector)
      {
        res.status(400).json({ message: 'Faltan datos para la asociación' });
        return;
      }

      const asociacion = await StoreSectoresService.asociarSector(id_solucion, id_sector);
      const sector = await StoreSectoresService.getSectorById(id_sector);
      const solucion = await StoreSolucionesService.getById(id_solucion);
      const sectoresActualizados = await StoreSectoresService.getByIdSectores(id_solucion);

      res.status(201).json({
        message: 'Sector asociado a la solución con éxito',
        asociacion,
        sector,
        sectoresActualizados,
      });
    }
    catch (error)
    {
      console.warn('⚠️ Error asociando el sector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Lista todos los sectores disponibles.
   * 
   * @param {Request} req - Objeto de solicitud HTTP.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista con todos los sectores.
   * 
   * @throws {500} Error interno del servidor al listar los sectores.
   */
  async listSectores(req: Request, res: Response): Promise<void>
  {
    try
    {
      const listSectores: StoreSectores[] = await StoreSectoresService.listSectores();

      if (!listSectores.length)
      {
        res.status(404).json({ message: 'No existen sectores' });
        return;
      }

      res.status(202).json(listSectores);
    }
    catch (error)
    {
      console.warn('⚠️ Error listando los sectores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listSectoresAmbitosSolucion(req: Request, res: Response): Promise<void>
  {
    try
    {
      const listSectoresAmbitosSolucion: SolucionAmbitoSector[] = await StoreSectoresService.listSectoresAmbitosSolucion();

      if (!listSectoresAmbitosSolucion.length)
      {
        res.status(404).json({ message: 'No existen sectores' });
        return;
      }

      res.status(202).json(listSectoresAmbitosSolucion);
    }
    catch (error)
    {
      console.warn('⚠️ Error listando los sectoresAmbitosSolucion:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Obtiene los sectores asociados a una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID de la solución.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve una lista de sectores asociados a la solución.
   * 
   * @throws {400} Si el ID de la solución no es válido.
   * @throws {500} Error interno del servidor al obtener los sectores de la solución.
   */
  async listIdSector(req: Request<{ idSolucion: string }>, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion } = req.params;

      if (!idSolucion)
      {
        console.info('ℹ️ ID de la solución no proporcionado');
        res.status(400).json({ message: 'ID de la solución no proporcionado' });
        return;
      }

      const sectorSolucion: StoreSectores[] = await StoreSectoresService.getByIdSectores(Number(idSolucion));

      if (!sectorSolucion || sectorSolucion.length === 0)
      {
        console.info(`ℹ️ No se encontraron sectores para la solución ${idSolucion}, devolviendo lista vacía.`);
        res.status(200).json([]); // Devolver 200 OK con un array vacío para evitar el error 404
        return;
      }

      console.log(`✅ Sectores recuperados correctamente para la solución ${idSolucion}`);
      res.status(200).json(sectorSolucion);
    }
    catch (error)
    {
      console.warn('⚠️ Error obteniendo los sectores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Modifica los datos de un sector asociado a una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el sector, y los datos a modificar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el resultado de la modificación del sector.
   * 
   * @throws {400} Si los datos proporcionados para la modificación no son válidos.
   * @throws {500} Error interno del servidor al modificar el sector.
   */
  async modifyStoreSectores(req: Request<{ idSolucion: string; idSector: string }, any, Partial<StoreSectores>>, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion, idSector } = req.params;
      const updateData = req.body;

      if (!idSolucion)
      {
        res.status(400).json({ message: 'ID de solucion no proporcionado' });
        return;
      }

      if (!idSector)
      {
        res.status(400).json({ message: 'ID de sector no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length)
      {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await StoreSectoresService.update(Number(idSector), Number(idSolucion), updateData);
      res.json(result);
    }
    catch (error)
    {
      console.error('Error al modificar storeSectores:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  /** 
   * Modifica los datos de un sector independiente de su asociación con una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID del sector y los datos a modificar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el resultado de la modificación del sector.
   * 
   * @throws {400} Si los datos proporcionados para la modificación no son válidos.
   * @throws {500} Error interno del servidor al modificar el sector.
   */
  async modifySector(req: Request<{ idSector: string }, any, Partial<StoreSectores>>, res: Response): Promise<void>
  {
    try
    {
      const { idSector } = req.params;
      const updateData = req.body;

      if (!idSector)
      {
        res.status(400).json({ message: 'ID de sector no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length)
      {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await StoreSectoresService.updateSector(Number(idSector), updateData);
      res.json(result);
    }
    catch (error)
    {
      console.error('Error al modificar storeSectores:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  /** 
   * Modifica los datos de un sector dentro de una solución específica.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID de la solución y los datos del sector a modificar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve el resultado de la modificación del sector de solución.
   * 
   * @throws {400} Si los datos proporcionados para la modificación no son válidos.
   * @throws {500} Error interno del servidor al modificar el sector de solución.
   */
  async modifySolucionSectores(req: Request<{ idSolucion: string }, any, SolucionSector>, res: Response): Promise<void>
  {
    try
    {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const solucionSector = req.body;

      if (!idSolucion)
      {
        res.status(400).json({ message: 'ID de solución no proporcionado' });
        return;
      }

      if (!solucionSector)
      {
        res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        return;
      }

      const result = await StoreSectoresService.updateSolucionSectores(
        idSolucion,
        solucionSector
      );

      res.status(200).json({
        message: 'Sector de solución actualizado correctamente',
        data: result,
      });
    }
    catch (error)
    {
      console.error('❌ Error al modificar sector de solución:', error);
      res.status(500).json({
        message: 'Error interno del servidor al modificar el sector de solución',
      });
    }
  }

  
  /**
   * Controlador que maneja la actualización de una relación entre solución, ámbito y sector.
   * 
   * @param {Request<SolucionAmbitoSector>} req - Objeto de solicitud HTTP con el cuerpo que contiene los datos a actualizar.
   * @param {Response} res - Objeto de respuesta HTTP.
   * @returns {Promise<void>} No retorna nada directamente, pero envía una respuesta HTTP con el resultado de la operación.
   * 
   * @throws {Error} Si no se proporcionan datos o si ocurre un error durante la actualización.
   */
  async modifySolucionAmbitosSectores(req: Request<SolucionAmbitoSector>, res: Response): Promise<void>
  {
    try
    {
      const solucionAmbitoSector = req.body;

      if (!solucionAmbitoSector)
      {
        res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        return;
      }

      const result = await StoreSectoresService.updateSolucionAmbitoSectores(solucionAmbitoSector);

      res.status(200).json({
        message: 'SectorAmbitoSolución actualizado correctamente',
        data: result,
      });
    }
    catch (error)
    {
      console.error('❌ Error al modificar sector de solución:', error);
      res.status(500).json({
        message: 'Error interno del servidor al modificar el sector de solución',
      });
    }
  }


  /** 
   * Elimina una relación entre un sector y una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el sector a eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje confirmando la eliminación.
   * 
   * @throws {400} Si faltan IDs en la solicitud.
   * @throws {500} Error interno del servidor al eliminar la relación.
   */
  async deleteSolucionSector(req: Request<{ idSolucion: string; idSector: string }>, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion, idSector } = req.params;

      if (!idSolucion || !idSector)
      {
        res.status(400).json({ message: 'IDs no proporcionados' });
        return;
      }

      const wasDeleted = await StoreSectoresService.deleteSolucionSector(
        Number(idSolucion),
        Number(idSector)
      );

      if (!wasDeleted)
      {
        console.info('ℹ️ Relación sector-solución no encontrada');
        res.status(404).json({ message: 'Relación sector-solución no encontrada' });
        return;
      }

      res.status(200).json({
        message: 'Relación sector-solución eliminada correctamente',
      });
    }
    catch (error)
    {
      console.warn('⚠️ Error al eliminar la relación sector-solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Elimina una relación entre un sector y una solución.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el sector a eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje confirmando la eliminación.
   * 
   * @throws {400} Si faltan IDs en la solicitud.
   * @throws {500} Error interno del servidor al eliminar la relación.
   */
  async deleteSolucionSectorAmbito(req: Request<{ idSolucion: string; idSector: string; idAmbito: string  }>, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion, idSector, idAmbito } = req.params;

      if (!idSolucion || !idSector || !idAmbito)
      {
        res.status(400).json({ message: 'IDs no proporcionados' });
        return;
      }

      const wasDeleted = await StoreSectoresService.deleteSolucionSectorAmbito(
        Number(idSolucion),
        Number(idSector),
        Number(idAmbito)
      );

      if (!wasDeleted)
      {
        console.info('ℹ️ Relación sector-solución-ambito no encontrada');
        res.status(404).json({ message: 'Relación sector-solución-ambito  no encontrada' });
        return;
      }

      res.status(200).json({
        message: 'Relación sector-solución-ambito  eliminada correctamente',
      });
    }
    catch (error)
    {
      console.warn('⚠️ Error al eliminar la relación sector-solución-ambito :', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Elimina un sector específico.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene los IDs de la solución y el sector a eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje confirmando la eliminación del sector.
   * 
   * @throws {400} Si faltan IDs en la solicitud.
   * @throws {500} Error interno del servidor al eliminar el sector.
   */
  async deleteSector(req: Request<{ idSolucion: string; idSector: string }>, res: Response): Promise<void>
  {
    try
    {
      const { idSolucion, idSector } = req.params;

      if (!idSolucion || !idSector)
      {
        res.status(401).json({ message: 'ID no proporcionado' });
        return;
      }

      const wasDeleted = await StoreSectoresService.deleteSector(Number(idSolucion), Number(idSector));

      if (!wasDeleted)
      {
        res.status(404).json({ message: 'Sector no encontrado o ya eliminado' });
        return;
      }

      res.status(201).json({ message: 'Sector eliminado correctamente' });
    }
    catch (error)
    {
      console.warn('⚠️ Error al eliminar el Sector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  /** 
   * Elimina un sector por su ID.
   * 
   * @param {Request} req - Objeto de solicitud HTTP que contiene el ID del sector a eliminar.
   * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
   * 
   * @returns {Promise<void>} Devuelve un mensaje confirmando la eliminación del sector.
   * 
   * @throws {400} Si faltan IDs en la solicitud.
   * @throws {500} Error interno del servidor al eliminar el sector.
   */
  async deleteSectorById(req: Request<{ idSector: string }>, res: Response): Promise<void>
  {
    try
    {
      const { idSector } = req.params;

      if (!idSector)
      {
        res.status(401).json({ message: 'ID no proporcionado' });
        return;
      }

      const wasDeleted = await StoreSectoresService.deleteSectorById(Number(idSector));

      if (!wasDeleted)
      {
        res.status(404).json({ message: 'Sector no encontrado o ya eliminado' });
        return;
      }

      res.status(201).json({ message: 'Sector eliminado correctamente' });
    }
    catch (error)
    {
      console.warn('⚠️ Error al eliminar el Sector:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new storeSectoresControllers();
