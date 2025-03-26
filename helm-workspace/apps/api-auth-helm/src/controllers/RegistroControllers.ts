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
            console.log('Request body received:', req.body);
            console.log('Request headers:', req.headers);
            console.log('Content-Type:', req.headers['content-type']);
            
            // Verificar si el cuerpo de la solicitud está vacío
            if (!req.body || Object.keys(req.body).length === 0) 
            {
                console.log('El cuerpo de la solicitud está vacío o no es un objeto JSON válido');
                res.status(400).json({ message: 'El cuerpo de la solicitud está vacío o no es un objeto JSON válido. Asegúrate de seleccionar "JSON" en el dropdown de Postman junto a la opción "raw".' });
                return;
            }
            
            // Extraer campos usando los nombres de columnas de la tabla
            const { email, username, pass } = req.body;

            // Validate required fields
            if (!email || !username || !pass) 
            {
                res.status(400).json({ message: 'Email, nombre de usuario y contraseña son requeridos' });
                return;
            }

            // Hasheo de la contraseña antes de guardarla 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(pass, salt);

            // Guarda usuario con la contraseña hasheada
            const nuevoUsuario = { 
                email, 
                username, 
                pass: hashedPassword
            };
            console.log('Attempting to save user:', nuevoUsuario);
            
            const [result]: any = await pool.promise().query('INSERT INTO store_users SET ?', [nuevoUsuario]);
            
            res.status(201).json({ message: 'Usuario creado', id: result.insertId });
        } 
        catch (error) 
        {
            console.error('Error al registrar usuario: ', error);
            console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}
export default new RegistrarController();