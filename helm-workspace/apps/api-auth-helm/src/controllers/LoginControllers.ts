import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class LoginController 
{
    /**
     * Maneja el inicio de sesión del usuario.
     */
    async loginUsuario(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { nombreUsuario, contraseña } = req.body;

            // Valida que los datos requeridos estén presentes
            if (!nombreUsuario || !contraseña) 
            {
                res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
                return;
            }

            // Busca el usuario por nombre de usuario
            const usuario = await AuthService.findUserByUsername(nombreUsuario);

            if (!usuario) 
            {
                console.log('No user found with username:', nombreUsuario);
                res.status(401).json({ message: 'Usuario no encontrado' });
                return;
            }

            // Valida la contraseña ingresada
            const contraseñaValida = await AuthService.validatePassword(contraseña, usuario.pass);

            if (!contraseñaValida) 
            {
                res.status(401).json({ message: 'Credenciales incorrectas' });
                return;
            }

            // Devuelve la información del usuario autenticado
            res.status(200).json({ 
                message: 'Usuario logueado con éxito',
                user: { id: usuario.id_user, username: usuario.username, email: usuario.email }
            });
        } 
        catch (error) 
        {
            console.error('Error al loguear usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new LoginController();
