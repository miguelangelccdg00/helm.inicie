import { Request, Response } from 'express';
import AuthService from '../services/AuthService';

class RegistrarController 
{
    async registrarUsuario(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const { email, username, pass } = req.body;

            if (!email || !username || !pass) 
            {
                res.status(400).json({ message: 'Email, usuario y contraseña son requeridos' });
                return;
            }

            if (!req.body || Object.keys(req.body).length === 0) 
            {
                res.status(400).json({ 
                    message: 'El cuerpo de la solicitud está vacío o no es un objeto JSON válido' 
                });
                return;
            }

            const newUser = await AuthService.createUser(email, username, pass);

            res.status(201).json({ message: 'Usuario creado', id: newUser.id });
        } 
        catch (error) 
        {
            console.error('Error al registrar usuario: ', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
}

export default new RegistrarController();
