import { Request, Response } from 'express';
import storeProblemasService from '../services/StoreProblemasService';
import storeSolucionesService from '../services/StoreSolucionesService';
import { StoreProblemas } from '../../../api-shared-helm/src/models/storeProblemas';

// DTO para crear problema
interface CreateStoreProblemaDTO {
    description: string,
    titulo: string,
    idSolucion: number
}

/**
 * Controlador para gestionar los problemas asociados a soluciones.
 */
class StoreProblemasController {
  
  async createProblema(req: Request, res: Response): Promise<void> {
    try {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description } = req.body as { description: string };

      if (!description || isNaN(idSolucion)) {
        res.status(400).json({ message: 'Faltan datos del problema o ID inválido' });
        return;
      }

      const problema = await storeProblemasService.createProblema({
        description,       
        idSolucion
      } as CreateStoreProblemaDTO);

      res.status(201).json({
        message: 'Problema creado y relacionado con la solución con éxito',
        problema
      });
    } catch (error) {
      console.error('Error creando el problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listProblemas(req: Request, res: Response): Promise<void> {
    try {
      const listProblema: StoreProblemas[] = await storeProblemasService.getProblemas();

      if (!listProblema.length) {
        res.status(404).json({ message: 'No existen problemas' });
        return;
      }

      res.status(200).json(listProblema);
    } catch (error) {
      console.error('Error listando problemas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listProblemasBySolucion(req: Request, res: Response): Promise<void> {
    try {
      const { idSolucion } = req.params;

      if (!idSolucion || isNaN(Number(idSolucion))) {
        res.status(400).json({ message: 'ID de la solución no válido' });
        return;
      }

      const problemasSolucion: StoreProblemas[] = await storeProblemasService.getByIdProblemas(Number(idSolucion));

      if (!problemasSolucion.length) {
        res.status(404).json({ message: 'No se encontraron problemas para esta solución' });
        return;
      }

      res.status(200).json(problemasSolucion);
    } catch (error) {
      console.error('Error obteniendo problemas por solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async modifyStoreProblemas(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body as Partial<StoreProblemas>;

      if (!id) {
        res.status(400).json({ message: 'ID no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length) {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await storeProblemasService.update(Number(id), updateData);
      res.json(result);
    } catch (error) {
      console.error('Error modificando storeProblemas:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  async deleteProblema(req: Request, res: Response): Promise<void> {
    try {
      const { idProblema } = req.params;

      if (!idProblema || isNaN(Number(idProblema))) {
        res.status(400).json({ message: 'ID no proporcionado o inválido' });
        return;
      }

      const wasDeleted = await storeProblemasService.deleteProblema(Number(idProblema));

      if (!wasDeleted) {
        res.status(404).json({ message: 'Problema no encontrado o ya eliminado' });
        return;
      }

      res.status(200).json({ message: 'Problema eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando problema:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  async asociarProblema(req: Request, res: Response): Promise<void> {
    try {
      const { id_solucion, id_problema } = req.body as { id_solucion: number; id_problema: number };

      if (!id_solucion) {
        res.status(401).json({ message: 'Falta el id_solucion para la asociación' });
        return;
      }

      if (!id_problema) {
        res.status(402).json({ message: 'Falta el id_problema para la asociación' });
        return;
      }

      const asociacion = await storeProblemasService.asociarProblema(id_solucion, id_problema);

      res.status(201).json({
        message: 'Problema asociado a la solución con éxito',
        asociacion
      });
    } catch (error) {
      console.error('Error asociando problema:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async removeProblemaFromSolucion(req: Request, res: Response): Promise<void> {
    try {
      const { idSolucion, idProblema } = req.params;

      if (!idSolucion || !idProblema) {
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
    } catch (error) {
      console.error('Error desasociando problema de solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new StoreProblemasController();
