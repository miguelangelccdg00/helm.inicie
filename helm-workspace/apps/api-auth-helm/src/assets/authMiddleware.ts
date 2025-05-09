import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Clave secreta para la verificación del token
const SECRET_KEY = 'token123';

// Definición de la interfaz AuthRequest para extender Request
export interface AuthRequest extends Request 
{
    user?: any;
}

// Middleware para verificar el token
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => 
{
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) 
    {       
        return res.redirect('/login');    
    }

    try 
    {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } 
    catch (error) 
    {
        console.error('Error al verificar el token: ', error);
        // Redirige también si el token es inválido o ha expirado
        
        return res.redirect('/login');
    }
};


/**
 * Middleware para verificar permisos basados en roles
 * @param roles Array de roles permitidos
 */
export const checkRole = (roles: string[]) => 
{
    return (req: AuthRequest, res: Response, next: NextFunction) =>
    { 

        if (!req.user) 
        {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }

        const userRole = req.user.role;

        if (!roles.includes(userRole)) 
        {
            return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
        }

        next();
    };
};

export default verifyToken;
