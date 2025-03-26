import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { usuario } from '../models/usuario';

class LoginController 
{
    async loginUsuario(req: Request, res: Response): Promise<void> 
    {
        try {
            console.log('Login attempt with body:', req.body);
            const { nombreUsuario, contraseña } = req.body;
            console.log('Attempting to find user with username:', nombreUsuario);

            // Buscar usuario en la base de datos
            const [rows]: any = await pool.promise().query('SELECT * FROM store_users WHERE username = ?', [nombreUsuario]);
            console.log('Query result rows:', rows.length);

            if (rows.length === 0) 
            {
                console.log('No user found with username:', nombreUsuario);
                res.status(401).json({ message: 'Usuario no encontrado' });
                return;
            }

            const usuario = rows[0];
            console.log('User found:', { id: usuario.id_user, username: usuario.username });

            // Comparar la contraseña ingresada con la hasheada en la base de datos
            const contraseñaValida = await bcrypt.compare(contraseña, usuario.pass);
            console.log('Password valid:', contraseñaValida);

            if (!contraseñaValida) 
            {
                res.status(401).json({ message: 'Credenciales incorrectas' });
                return;
            }

            res.status(200).json({ 
                message: 'Usuario logueado con éxito',
                user: {
                    id: usuario.id_user,
                    username: usuario.username,
                    email: usuario.email
                }
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