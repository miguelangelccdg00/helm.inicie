import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import jwt from 'jsonwebtoken';

// Definir una clave secreta para la generación del token JWT
const SECRET_KEY = 'token123';

class LoginController {
    /**
     * Inicia sesión de un usuario y genera un token de acceso.
     * 
     * @param {Request} req - Objeto de solicitud HTTP que contiene los datos enviados por el cliente.
     * @param {string} req.body.nombreUsuario - Nombre de usuario del que se desea iniciar sesión.
     * @param {string} req.body.contraseña - Contraseña asociada al nombre de usuario.
     * @param {Response} res - Objeto de respuesta HTTP utilizado para enviar una respuesta al cliente.
     * 
     * @returns {Promise<void>} Devuelve un mensaje con el token JWT y detalles del usuario si la autenticación es exitosa.
     * 
     * @throws {401} Si el usuario no se encuentra o la contraseña es incorrecta, devuelve un error con un mensaje adecuado.
     * @throws {500} Error interno en el servidor en caso de fallos al intentar autenticar al usuario.
     */
    //@Post('/login/loginUsuario') 
    async loginUsuario(req: Request, res: Response): Promise<void> {
        try {
            // Extraemos los datos de nombreUsuario y contraseña del cuerpo de la solicitud
            const { nombreUsuario, contraseña } = req.body;

            // Verifica que los campos necesarios estén presentes
            if (!nombreUsuario || !contraseña) {
                res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
                return;
            }

            // Busca el usuario por su nombre de usuario en el servicio AuthService
            const usuario = await AuthService.findUserByUsername(nombreUsuario);

            // Verifica si el usuario existe
            if (!usuario) {
                res.status(401).json({ message: 'Usuario no encontrado' });
                return;
            }

            // Valida la contraseña del usuario usando AuthService
            const contraseñaValida = await AuthService.validatePassword(contraseña, usuario.pass);

            // Si la contraseña es incorrecta, se retorna un error
            if (!contraseñaValida) {
                res.status(401).json({ message: 'Credenciales incorrectas' });
                return;
            }

            // Genera un token JWT para el usuario
            const token = jwt.sign(
                { id: usuario.id_user, username: usuario.username },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            // Devuelve el token y los detalles del usuario en la respuesta
            res.status(200).json({
                message: 'Usuario logueado con éxito',
                token,
                user: {
                    id: usuario.id_user,
                    username: usuario.username,
                    email: usuario.email
                }
            });
        } catch (error) {
            // Maneja cualquier error interno y responde con un mensaje de error
            console.error('Error al loguear usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new LoginController();
