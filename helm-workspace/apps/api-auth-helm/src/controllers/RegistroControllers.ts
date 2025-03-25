import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { usuario } from '../models/usuario';

class RegistrarController 
{
    async registrarUsuario(req: Request, res: Response): Promise<void> 
    {
        try
        {

            const { nombreUsuario, contraseña } = req.body;

            // Hasheo de la contraseña antes de guardarla 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contraseña, salt);

            // Guarda usuario con la contraseña hasheada
            const nuevoUsuario: usuario = { nombreUsuario, contraseña: hashedPassword};
            const [result]: any = await pool.promise().query('INSERT INTO usuario SET ?', [nuevoUsuario]);
            
            res.status(201).json({ message: 'Usuario creado', id: result.insertId });
        } 
        catch (error) 
        {
            console.error('Error al registrar usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}
export default new RegistrarController();
