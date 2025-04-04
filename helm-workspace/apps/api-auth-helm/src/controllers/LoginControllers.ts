// controllers/LoginController.ts
import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'token123';

class LoginController {
    async loginUsuario(req: Request, res: Response): Promise<void> {
        try {
            const { nombreUsuario, contraseña } = req.body;

            if (!nombreUsuario || !contraseña) {
                res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
                return;
            }

            const usuario = await AuthService.findUserByUsername(nombreUsuario);

            if (!usuario) {
                res.status(401).json({ message: 'Usuario no encontrado' });
                return;
            }

            const contraseñaValida = await AuthService.validatePassword(contraseña, usuario.pass);

            if (!contraseñaValida) {
                res.status(401).json({ message: 'Credenciales incorrectas' });
                return;
            }

            const token = jwt.sign(
                { id: usuario.id_user, username: usuario.username },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

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
            console.error('Error al loguear usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new LoginController();
