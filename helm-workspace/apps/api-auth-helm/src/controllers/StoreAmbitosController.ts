import { Request, Response } from 'express';
import StoreAmbitosService from '../services/StoreAmbitosService';
import storeSolucionesService from '../services/StoreSolucionesService';
import { StoreAmbitos } from '../../../api-shared-helm/src/models/storeAmbitos'; // Ajusta la ruta de importación

interface CreateAmbitoBody extends Omit<StoreAmbitos, 'id_ambito'> {}
interface AsociarAmbitoBody {
  id_solucion: number;
  id_ambito: number;
}

class StoreAmbitosController {
  
  async createAmbitos(req: Request<{ idSolucion: string }, any, CreateAmbitoBody>, res: Response): Promise<void> {
    try {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description, textoweb, prefijo, slug } = req.body;

      if (!description || !textoweb || !prefijo || !slug || isNaN(idSolucion)) {
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

      const ambitoCreado = await StoreAmbitosService.getAmbitoById(resultado.idAmbito);

      res.status(201).json({
        ...resultado,
        ambito: ambitoCreado
      });
    } catch (error) {
      console.error('Error en createAmbitos:', error);
      res.status(500).json({ message: 'Error interno del servidor al crear el ámbito.' });
    }
  }

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

  async listAmbitos(req: Request, res: Response): Promise<void> {
    try {
      const listAmbitos: StoreAmbitos[] = await StoreAmbitosService.listAmbitos();

      if (!listAmbitos.length) {
        res.status(404).json({ message: 'No existen ambitos' });
        return;
      }

      res.status(202).json(listAmbitos);
    } catch (error) {
      console.error('Error listando los ambitos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listIdAmbito(req: Request<{ idSolucion: string }>, res: Response): Promise<void> {
    try {
      const { idSolucion } = req.params;

      if (!idSolucion) {
        res.status(400).json({ message: 'ID de la solución no proporcionado' });
        return;
      }

      const ambitoSolucion: StoreAmbitos[] = await StoreAmbitosService.getByIdAmbitos(Number(idSolucion));

      if (!ambitoSolucion || ambitoSolucion.length === 0) {
        res.status(404).json({ message: 'No se encontraron ambitos para esta solución' });
        return;
      }

      res.status(200).json(ambitoSolucion);
    } catch (error) {
      console.error('Error obteniendo los ambitos:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

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

  async getVariantesSolucionPorAmbito(req: Request<{ idSolucion: string }>, res: Response): Promise<void> {
    try {
      const { idSolucion } = req.params;

      if (!idSolucion) {
        res.status(400).json({ message: 'ID de solución es requerido' });
        return;
      }

      const variantes = await StoreAmbitosService.getVariantesBySolucionAndAmbito(Number(idSolucion));

      if (!variantes.length) {
        res.status(404).json({ message: 'No se encontraron variantes para la combinación dada' });
        return;
      }

      res.status(200).json(variantes);
    } catch (error) {
      console.error('Error obteniendo las variantes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new StoreAmbitosController();
