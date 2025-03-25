import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import { usuario } from '../models/usuario';

class LoginController 
{
    async loginUsuario(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { nombreUsuario, contraseña } = req.body;
            const [rows]: any = await pool.promise().query('SELECT * FROM usuario WHERE nombreUsuario = ? AND contraseña = ?', [nombreUsuario, contraseña]);

            if (rows.length > 0) 
                {
                res.status(200).json({ message: 'Usuario logueado con éxito' });
            } 
            else 
            {
                res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } 
        catch (error) 
        {
            console.error('Error al loguear usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}
export default new LoginController();
