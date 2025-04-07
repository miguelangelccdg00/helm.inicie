import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';

import registroRoutes from './routes/RegistroRoute';
import loginRoutes from './routes/LoginRoute';
import storeSolucionesRoute from './routes/StoreSolucionesRoute';
import storeBeneficiosRoute from './routes/StoreBeneficiosRoute';
import storeProblemasRoute from './routes/StoreProblemasRoute';
import storeCaracteristicasRoute from './routes/StoreCaracteristicasRoute';
import menuRoutes from './routes/MenuRoute';
import tokenRoute from './routes/TokenRoute';

import  verifyToken  from './assets/authMiddleware';

const app: Application = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/login', loginRoutes);
app.use('/registro', registroRoutes);

// Middleware para proteger todas las rutas siguientes
//app.use(verifyToken);

// Rutas protegidas
app.use('/storeSolucion', storeSolucionesRoute);
app.use('/storeBeneficios', storeBeneficiosRoute);
app.use('/storeProblemas', storeProblemasRoute);
app.use('/storeCaracteristicas', storeCaracteristicasRoute);
app.use('/menu', menuRoutes);
app.use('/token', tokenRoute);

/**
 * Ruta raíz protegida
 */
app.get('/', (req: Request, res: Response): void =>
{
    res.json({
        message: 'Bienvenido a la API de Tickets (autenticado)',
        endpoints: [
            {
                login:
                {
                    base: 'login',
                    operations: [{ method: 'POST', path: '/loginUsuario' }]
                }
            },
            {
                registro:
                {
                    base: 'registro',
                    operations: [{ method: 'POST', path: '/registrarUsuario' }]
                }
            },
            {
                storeSolucion:
                {
                    base: 'storeSolucion',
                    operations: [
                        { method: 'GET', path: '/listStoreSoluciones' },
                        { method: 'GET', path: '/listIdStoreSoluciones/:id' },
                        { method: 'PUT', path: '/modifyStoreSoluciones/:id' },
                        { method: 'DELETE', path: '/deleteSolucion/:id' }
                    ]
                }
            },
            {
                storeBeneficios:
                {
                    base: 'storeBeneficios',
                    operations: [
                        { method: 'GET', path: '/listCompleteBeneficios' },
                        { method: 'GET', path: '/listBeneficios/:id' },
                        { method: 'POST', path: '/createBeneficio/:idSolucion' },
                        { method: 'DELETE', path: '/deleteBeneficio/:idBeneficio' }
                    ]
                }
            },
            {
                storeProblemas:
                {
                    base: 'storeProblemas',
                    operations: [
                        { method: 'GET', path: '/listCompleteProblemas' },
                        { method: 'GET', path: '/listProblemas/:idSolucion' },
                        { method: 'POST', path: '/createProblema/:idSolucion' },
                        { method: 'DELETE', path: '/deleteProblema/:idProblema' }
                    ]
                }
            },
            {
                storeCaracteristicas:
                {
                    base: 'storeCaracteristicas',
                    operations: [
                        { method: 'GET', path: '/listCompleteCaracteristicas' },
                        { method: 'GET', path: '/listCaracteristicas/:idSolucion' },
                        { method: 'POST', path: '/createCaracteristicas/:idSolucion' },
                        { method: 'DELETE', path: '/deleteCaracteristicas/:idCaracteristicas' }
                    ]
                }
            },
            {
                menu:
                {
                    base: 'menu',
                    operations: [
                        { method: 'GET', path: '/items' },
                        { method: 'GET', path: '/submenus' }
                    ]
                }
            }
        ]
    });
});

export default app;
