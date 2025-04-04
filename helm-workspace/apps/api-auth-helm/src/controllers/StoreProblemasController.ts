import { Request, Response } from 'express';
import storeProblemasService from '../services/StoreProblemasService';
import storeSolucionesService from '../services/StoreSolucionesService';

/**
 * Controlador para gestionar los problemas asociados a soluciones.
 */
class StoreProblemasController {
    /**
     * Crea un nuevo problema y lo asocia a una solución.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución con la que se relacionará el problema.
     * @param {string} req.body.description - Descripción del problema.
     * @param {string} req.body.titulo - Título del problema.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async createProblema(req: Request, res: Response): Promise<void> {
        try {
            const idSolucion = parseInt(req.params.idSolucion, 10);
            const { description, titulo } = req.body;

            if (!description || isNaN(idSolucion)) {
                res.status(400).json({ message: 'Faltan datos del problema o ID inválido' });
                return;
            }

            const problema = await storeProblemasService.createProblema({
                description,
                titulo,
                idSolucion
            } as any);

            const solucion = await storeSolucionesService.getById(idSolucion);
            if (solucion) {
                await storeSolucionesService.update(idSolucion, {
                    problemaTitle: titulo || solucion.problemaTitle,
                    problemaPragma: description || solucion.problemaPragma
                });
            }

            res.status(201).json({
                message: 'Problema creado y relacionado con la solución con éxito',
                problema
            });
        } catch (error) {
            console.error('Error creando el problema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Lista todos los problemas disponibles.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listProblema(req: Request, res: Response): Promise<void> {
        try {
            const listProblema = await storeProblemasService.getProblemas();

            if (!listProblema.length) {
                res.status(404).json({ message: 'No existen problemas' });
                return;
            }

            res.status(200).json(listProblema);
        } catch (error) {
            console.error('Error listando los problemas:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Lista los problemas relacionados a una solución específica.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async listIdProblema(req: Request, res: Response): Promise<void> {
        try {
            const { idSolucion } = req.params;

            if (!idSolucion || isNaN(Number(idSolucion))) {
                res.status(400).json({ message: 'ID de la solución no válido' });
                return;
            }

            const problemasSolucion = await storeProblemasService.getByIdProblemas(Number(idSolucion));

            if (!problemasSolucion.length) {
                res.status(404).json({ message: 'No se encontraron problemas para esta solución' });
                return;
            }

            res.status(200).json(problemasSolucion);
        } catch (error) {
            console.error('Error obteniendo los problemas:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Asocia un problema existente a una solución.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {number} req.body.id_solucion - ID de la solución.
     * @param {number} req.body.id_problema - ID del problema.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async asociarProblema(req: Request, res: Response): Promise<void> {
        try {
            const { id_solucion, id_problema } = req.body;

            if (!id_solucion || !id_problema) {
                res.status(400).json({ message: 'Faltan datos para la asociación' });
                return;
            }

            const asociacion = await storeProblemasService.asociarProblema(id_solucion, id_problema);

            const problema = await storeProblemasService.getProblemaById(id_problema);
            if (problema) {
                const solucion = await storeSolucionesService.getById(id_solucion);
                if (solucion) {
                    await storeSolucionesService.update(id_solucion, {
                        problemaTitle: problema.titulo || solucion.problemaTitle,
                        problemaPragma: problema.description || solucion.problemaPragma
                    });
                }
            }

            res.status(201).json({
                message: 'Problema asociado a la solución con éxito',
                asociacion
            });
        } catch (error) {
            console.error('Error asociando el problema:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    /**
     * Elimina un problema existente por su ID.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idProblema - ID del problema a eliminar.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    async deleteProblema(req: Request, res: Response): Promise<void> {
        try {
            const { idProblema } = req.params;

            if (!idProblema || isNaN(Number(idProblema))) {
                res.status(400).json({ message: 'ID inválido' });
                return;
            }

            const wasDeleted = await storeProblemasService.deleteProblema(Number(idProblema));

            if (!wasDeleted) {
                res.status(404).json({ message: 'Problema no encontrado o ya eliminado' });
                return;
            }

            res.status(200).json({ message: 'Problema eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el problema:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }

    /**
     * Desasocia un problema de una solución sin eliminarlo.
     *
     * @param {Request} req - Objeto de solicitud HTTP.
     * @param {string} req.params.idSolucion - ID de la solución.
     * @param {string} req.params.idProblema - ID del problema a desasociar.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
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
            console.error('Error al desasociar el problema de la solución:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new StoreProblemasController();
