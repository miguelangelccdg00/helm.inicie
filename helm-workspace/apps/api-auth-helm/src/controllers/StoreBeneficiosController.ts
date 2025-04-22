import { Request, Response } from 'express';
import storeBeneficiosService from '../services/StoreBeneficiosService';
import StoreBeneficiosService from '../services/StoreBeneficiosService';
import { StoreBeneficios } from '../../../api-shared-helm/src/models/storeBeneficios';

// DTO para crear beneficio
interface CreateStoreBeneficioDTO {
  description: string;
  idSolucion: number;
}

/**
 * Controlador para gestionar los beneficios asociados a soluciones.
 */
class StoreBeneficiosControllers {
  async createBeneficio(req: Request, res: Response): Promise<void> {
    try {
      const idSolucion = parseInt(req.params.idSolucion, 10);
      const { description } = req.body as { description: string };

      if (!description || isNaN(idSolucion)) {
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
    } catch (error) {
      console.error('Error creando el beneficio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listBeneficios(req: Request, res: Response): Promise<void> {
    try {
      const { idSolucion } = req.params;

      if (!idSolucion || isNaN(Number(idSolucion))) {
        res.status(400).json({ message: 'ID de la solución no válido' });
        return;
      }

      const beneficiosSolucion: StoreBeneficios[] = await storeBeneficiosService.getByIdBeneficio(Number(idSolucion));

      if (!beneficiosSolucion.length) {
        res.status(404).json({ message: 'No se encontraron beneficios para esta solución' });
        return;
      }

      res.status(200).json(beneficiosSolucion);
    } catch (error) {
      console.error('Error obteniendo beneficios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async listCompleteBeneficios(req: Request, res: Response): Promise<void> {
    try {
      const listBeneficio: StoreBeneficios[] = await storeBeneficiosService.getBeneficio();

      if (!listBeneficio.length) {
        res.status(404).json({ message: 'No existen beneficios' });
        return;
      }

      res.status(200).json(listBeneficio);
    } catch (error) {
      console.error('Error obteniendo beneficios:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  async modifyStoreBeneficios(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body as Partial<StoreBeneficios>;

      if (!id) {
        res.status(400).json({ message: 'ID no proporcionado' });
        return;
      }

      if (!Object.keys(updateData).length) {
        res.status(400).json({ message: 'No se proporcionaron datos' });
        return;
      }

      const result = await StoreBeneficiosService.update(Number(id), updateData);
      res.json(result);
    } catch (error) {
      console.error('Error al modificar storeSoluciones:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  async deleteBeneficio(req: Request, res: Response): Promise<void> {
    try {
      const { idBeneficio } = req.params;

      if (!idBeneficio || isNaN(Number(idBeneficio))) {
        res.status(400).json({ message: 'ID no proporcionado o inválido' });
        return;
      }

      const wasDeleted = await storeBeneficiosService.deleteBeneficio(Number(idBeneficio));

      if (!wasDeleted) {
        res.status(404).json({ message: 'Beneficio no encontrado o ya eliminado' });
        return;
      }

      res.status(200).json({ message: 'Beneficio eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el beneficio:', error);
      res.status(500).json({ message: 'Error interno en el servidor' });
    }
  }

  async asociarBeneficio(req: Request, res: Response): Promise<void> {
    try {
      const { id_solucion, id_beneficio } = req.body as { id_solucion: number; id_beneficio: number };

      if (!id_solucion) {
        res.status(401).json({ message: 'Faltan datos para la asociación en el id_solucion' });
        return;
      }

      if (!id_beneficio) {
        res.status(402).json({ message: 'Faltan datos para la asociación en el id_beneficio' });
        return;
      }

      const asociacion = await storeBeneficiosService.asociarBeneficio(id_solucion, id_beneficio);

      res.status(201).json({
        message: 'Beneficio asociado a la solución con éxito',
        asociacion
      });
    } catch (error) {
      console.error('Error asociando el beneficio:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default new StoreBeneficiosControllers();
