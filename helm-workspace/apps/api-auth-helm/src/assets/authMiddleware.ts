// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'token123';

// Definición de la interfaz AuthRequest para extender Request
export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) =>
{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

/**
 * Middleware para verificar permisos basados en roles
 * @param roles Array de roles permitidos
 */
export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;
        
        if (!authReq.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        
        const userRole = authReq.user.role;
        
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'No tienes permisos para acceder a este recurso' });
        }
        
        next();
    };
};
