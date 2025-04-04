import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class RegistrarController {
    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param {Request} req - Objeto de solicitud HTTP que contiene los datos del nuevo usuario a registrar.
     * @param {string} req.body.email - Correo electrónico del usuario.
     * @param {string} req.body.username - Nombre de usuario del nuevo usuario.
     * @param {string} req.body.pass - Contraseña del usuario.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Una promesa que resuelve cuando se envía la respuesta.
     * 
     * @throws {400} Si alguno de los campos requeridos (email, username, pass) falta en la solicitud.
     * @throws {400} Si el cuerpo de la solicitud está vacío o no es un objeto JSON válido.
     * @throws {500} Error interno en el servidor si hay un problema durante el registro del usuario.
     */
    async registrarUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { email, username, pass } = req.body;

            // Valida que los datos requeridos estén presentes
            if (!email || !username || !pass) {
                res.status(400).json({ message: 'Email, usuario y contraseña son requeridos' });
                return;
            }

            // Valida si el cuerpo de la solicitud está vacío
            if (!req.body || Object.keys(req.body).length === 0) {
                res.status(400).json({
                    message: 'El cuerpo de la solicitud está vacío o no es un objeto JSON válido'
                });
                return;
            }

            // Llama al servicio de autenticación para crear el usuario
            const newUser = await AuthService.createUser(email, username, pass);

            res.status(201).json({ message: 'Usuario creado', id: newUser.id });
        } catch (error) {
            console.error('Error al registrar usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new RegistrarController();
