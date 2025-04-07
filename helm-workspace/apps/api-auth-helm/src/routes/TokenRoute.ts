// routes/privada.ts
import { Router } from 'express';
import { AuthRequest } from '../assets/authMiddleware';
import verifyToken from '../assets/authMiddleware';

const router = Router();

/**
 * @description Ruta de prueba protegida
 */
router.get('/perfil', verifyToken, (req: AuthRequest, res) => 
{
    res.json({
        message: 'Acceso permitido al perfil',
        usuario: req.user
    });
});

export default router;
