import { Request, Response } from 'express';
import StoreSectoresService from '../services/StoreSectoresService';
import StoreSolucionesService from '../services/StoreSolucionesService';
import { StoreSectores } from '../../../api-shared-helm/src/models/storeSectores';

interface CreateSectorBody extends Omit<StoreSectores, 'id_sector'> {}

interface AsociarSectorBody
{
  id_solucion: number;
  id_sector: number;
}

class storeSectoresControllers
{
  async createSectores(req: Request<{ idSolucion: string }, any, CreateSectorBody>, res: Response): Promise<void> 
  {
    try 
    {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage } = req.body;

      if (!description || !textoWeb || !prefijo || !slug || !descriptionweb || !titleweb || !backgroundImage || isNaN(idSolucion)) 
      {
        res.status(400).json({ message: 'Faltan datos requeridos para crear el sector.' });
        return;
      }

      const resultado = await StoreSectoresService.createSector({
        description, textoWeb, prefijo, slug, descriptionweb, titleweb, backgroundImage,idSolucion});

      const sectorCreado = await StoreSectoresService.getSectorById(resultado.id_sector);

      res.status(201).json({
        ...resultado,
        sector: sectorCreado
      });
    } 
    catch (error) 
    {
      console.error('Error en createSectores:', error);
      res.status(500).json({ message: 'Error interno del servidor al crear el sector.' });
    }
  }
  
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
          sectoresActualizados
          });

      } 
      catch (error) 
      {
          console.error('Error asociando el sector:', error);
          res.status(500).json({ message: 'Error interno del servidor' });
      }
  }

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
      console.error('Error listando los sectores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listIdSector(req: Request<{ idSolucion: string }>, res: Response): Promise<void> 
  {
    try 
    {
      const { idSolucion } = req.params;

      if (!idSolucion) 
      {
        res.status(400).json({ message: 'ID de la solución no proporcionado' });
        return;
      }

      const sectorSolucion: StoreSectores[] = await StoreSectoresService.getByIdSectores(Number(idSolucion));

      if (!sectorSolucion || sectorSolucion.length === 0) 
      {
        res.status(404).json({ message: 'No se encontraron sectores para esta solución' });
        return;
      }

      res.status(200).json(sectorSolucion);

    } 
    catch (error) 
    {
      console.error('Error obteniendo los sectores:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async getVariantesSolucionPorSector(req: Request<{ idSolucion: string }>, res: Response): Promise<void> 
  {
    try 
    {
      const { idSolucion } = req.params;

      if (!idSolucion)
      {
        res.status(400).json({ message: 'ID de solución es requerido' });
        return;
      }

      const variantes = await StoreSectoresService.getVariantesBySolucionAndSector(Number(idSolucion));

      if (!variantes.length) 
      {
        res.status(404).json({ message: 'No se encontraron variantes para la combinación dada' });
        return;
      }

      res.status(200).json(variantes);
    } 
    catch (error) 
    {
      console.error('Error obteniendo las variantes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new storeSectoresControllers();