import { Request, Response } from 'express';
import storeSolucionesService from '../services/StoreSolucionesService';
import StoreCaracteristicasService from '../services/StoreCaracteristicasService';
import { StoreCaracteristicas } from '../../../api-shared-helm/src/models/storeCaracteristicas';

// DTO para crear característica
interface CreateStoreCaracteristicaDTO {
  description: string;
  titulo: string;
  idSolucion: number;
}

// DTO para asociar característica
interface AsociarCaracteristicaDTO {
  id_solucion: number;
  id_caracteristica: number;
}

/**
 * Controlador para gestionar las características asociadas a soluciones.
 */
class StoreCaracteristicasController {
  async createCaracteristicas(req: Request, res: Response): Promise<void> {
    try {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description, titulo } = req.body as { description: string; titulo?: string };

      if (!description || isNaN(idSolucion)) {
        res.status(400).json({ message: 'Faltan datos de características o ID inválido' });
        return;
      }

      const caracteristica = await StoreCaracteristicasService.createCaracteristica({
        description,
        titulo,
        idSolucion
      } as CreateStoreCaracteristicaDTO);

      const solucion = await storeSolucionesService.getById(idSolucion);
      if (solucion) {
        await storeSolucionesService.update(idSolucion, {
          caracteristicasTitle: titulo || solucion.caracteristicasTitle,
          caracteristicasPragma: description || solucion.caracteristicasPragma
        });
      }

      res.status(201).json({
        message: 'Característica creada y relacionada con la solución con éxito',
        caracteristica
      });
    } catch (error) {
      console.error('Error creando la característica:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async asociarCaracteristica(req: Request, res: Response): Promise<void> {
    try {
      const { id_solucion, id_caracteristica } = req.body as AsociarCaracteristicaDTO;

      if (!id_solucion) {
        res.status(401).json({ message: 'Faltan datos para la asociación en el id_solucion' });
        return;
      }
      if (!id_caracteristica) {
        res.status(402).json({ message: 'Faltan datos para la asociación en el id_caracteristica' });
        return;
      }

      const asociacion = await StoreCaracteristicasService.asociarCaracteristica(id_solucion, id_caracteristica);

      const caracteristicas = await StoreCaracteristicasService.getCaracteristicaById(id_caracteristica);
      if (caracteristicas) {
        const solucion = await storeSolucionesService.getById(id_solucion);
        if (solucion) {
          await storeSolucionesService.update(id_solucion, 
          {
            caracteristicasTitle:  solucion.caracteristicasTitle,
            caracteristicasPragma: caracteristicas.description || solucion.caracteristicasPragma
          });
        }
      }

      res.status(201).json({
        message: 'Característica asociada a la solución con éxito',
        asociacion
      });
    } catch (error) {
      console.error('Error asociando la característica:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listCaracteristica(req: Request, res: Response): Promise<void> {
    try {
      const listCaracteristica: StoreCaracteristicas[] = await StoreCaracteristicasService.listCaracteristicas();

      if (!listCaracteristica.length) {
        res.status(404).json({ message: 'No existen características' });
        return;
      }

      res.status(200).json(listCaracteristica);
    } catch (error) {
      console.error('Error listando las características:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listIdCaracteristica(req: Request, res: Response): Promise<void> {
    try {
      const { idSolucion } = req.params;

      if (!idSolucion || isNaN(Number(idSolucion))) {
        res.status(400).json({ message: 'ID de la solución no válido' });
        return;
      }

      const caracteristicaSolucion: StoreCaracteristicas[] = await StoreCaracteristicasService.getByIdCaracteristicas(Number(idSolucion));

      if (!caracteristicaSolucion.length) {
        console.info(`ℹ️ No se encontraron ámbitos para la solución ${idSolucion}, devolviendo lista vacía.`);
        res.status(200).json([]); // Devolver 200 OK con un array vacío para evitar el error 404
        return;
      }

      res.status(200).json(caracteristicaSolucion);
    } catch (error) {
      console.error('Error obteniendo las características:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async modifyStoreCaracteristicas(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body as Partial<StoreCaracteristicas>;

      if (!id) {
        res.status(400).json({ message: 'ID no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length) {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await StoreCaracteristicasService.update(Number(id), updateData);
      res.json(result);
    } catch (error) {
      console.error('Error al modificar storeCaracteristicas:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async deleteCaracteristica(req: Request, res: Response): Promise<void> {
    try {
      const { idCaracteristica } = req.params;

      if (!idCaracteristica || isNaN(Number(idCaracteristica))) {
        res.status(400).json({ message: 'ID no proporcionado o inválido' });
        return;
      }

      const wasDeleted = await StoreCaracteristicasService.deleteCaracteristica(Number(idCaracteristica));

      if (!wasDeleted) {
        res.status(404).json({ message: 'Característica no encontrada o ya eliminada' });
        return;
      }

      res.status(200).json({ message: 'Característica eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la característica:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async removeCaracteristicaFromSolucion(req: Request, res: Response): Promise<void> {
    try {
      const { idSolucion, idCaracteristica } = req.params;

      if (!idSolucion || !idCaracteristica) {
        res.status(400).json({ message: 'IDs de solución y característica son requeridos' });
        return;
      }

      await storeSolucionesService.removeCaracteristicaFromSolucion(
        Number(idSolucion),
        Number(idCaracteristica)
      );

      res.status(200).json({
        message: 'Característica desasociada de la solución correctamente'
      });
    } catch (error) {
      console.error('Error al desasociar la característica de la solución:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new StoreCaracteristicasController();
