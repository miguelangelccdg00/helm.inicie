import { Request, Response } from 'express';
import storeBeneficiosService from '../services/StoreBeneficiosService';

/**
 * Controlador para gestionar los beneficios asociados a soluciones.
 */
class StoreBeneficiosControllers {
    /**
     * Crea un nuevo beneficio y lo asocia a una solución.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución con la que se relacionará el beneficio.
     * @param {string} req.body.description - Descripción del beneficio.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async createBeneficio(req: Request, res: Response): Promise<void> {
        try {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description } = req.body;

            if (!description || isNaN(idSolucion)) {
                res.status(400).json({ message: 'Faltan datos del beneficio o ID inválido' });
                return;
            }

            const beneficio = await storeBeneficiosService.createBeneficio({
                description,
                idSolucion
            });

            res.status(201).json({
                message: 'Beneficio creado y relacionado con la solución con éxito',
                beneficio
            });
        } catch (error) {
            console.error('Error creando el beneficio:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Lista los beneficios relacionados a una solución específica.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listBeneficios(req: Request, res: Response): Promise<void> {
        try {
            const { idSolucion } = req.params;

            if (!idSolucion || isNaN(Number(idSolucion))) {
                res.status(400).json({ message: 'ID de la solución no válido' });
                return;
            }

            const beneficiosSolucion = await storeBeneficiosService.getByIdBeneficio(Number(idSolucion));

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

    /**
     * Lista todos los beneficios registrados en la base de datos.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listCompleteBeneficios(req: Request, res: Response): Promise<void> {
        try {
            const listBeneficio = await storeBeneficiosService.getBeneficio();

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

    /**
     * Elimina un beneficio existente por su ID.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idBeneficio - ID del beneficio a eliminar.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
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

    /**
     * Asocia un beneficio existente a una solución.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {number} req.body.id_solucion - ID de la solución.
     * @param {number} req.body.id_beneficio - ID del beneficio a asociar.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async asociarBeneficio(req: Request, res: Response): Promise<void> {
        try {
            const { id_solucion, id_beneficio } = req.body;

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
