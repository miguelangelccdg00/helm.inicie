import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { usuario } from '../models/usuario';

class LoginController 
{
    async loginUsuario(req: Request, res: Response): Promise<void> 
    {
        try {
            const { nombreUsuario, contraseña } = req.body;

            // Buscar usuario en la base de datos
            const [rows]: any = await pool.promise().query('SELECT * FROM usuario WHERE nombreUsuario = ?', [nombreUsuario]);

            if (rows.length === 0) 
            {
                res.status(401).json({ message: 'Usuario no encontrado' });
                return ;
            }

            const usuario = rows[0];

            // Comparar la contraseña ingresada con la hasheada en la base de datos
            const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

            if (!contraseñaValida) 
            {
                res.status(401).json({ message: 'Credenciales incorrectas' });
                return;
            }

            res.status(200).json({ message: 'Usuario logueado con éxito' });
        } 
        catch (error) 
        {
            console.error('Error al loguear usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}
export default new LoginController();
