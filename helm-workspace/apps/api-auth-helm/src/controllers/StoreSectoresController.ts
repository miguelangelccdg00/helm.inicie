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
            const ambito = await StoreSectoresService.getSectorById(id_sector);
            const solucion = await StoreSolucionesService.getById(id_solucion);
            const ambitosActualizados = await StoreSectoresService.getByIdSectores(id_solucion);

            res.status(201).json({
            message: 'Sector asociado a la solución con éxito',
            asociacion,
            ambito,
            ambitosActualizados
            });

        } 
        catch (error) 
        {
            console.error('Error asociando el sector:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
}

export default new storeSectoresControllers();