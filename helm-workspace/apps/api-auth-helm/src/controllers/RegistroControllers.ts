import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { Request, Response } from 'express';
import { usuario } from '../models/usuario.js';

class RegistrarController 
{
    async registrarUsuario(req: Request, res: Response): Promise<void> 
    {
        try
        {
            const nuevoUsuario: usuario = req.body;
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
