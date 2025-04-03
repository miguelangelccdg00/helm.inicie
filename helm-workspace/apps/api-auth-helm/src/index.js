import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import registroRoutes from './routes/RegistroRoute';
import loginRoutes from './routes/LoginRoute';
import storeSolucionesRoute from './routes/StoreSolucionesRoute';
import storeBeneficiosRoute from './routes/StoreBeneficiosRoute';
import storeProblemasRoute from './routes/StoreProblemasRoute';
import storeCaracteristicasRoute from './routes/StoreCaracteristicasRoute';
import menuRoutes from './routes/MenuRoute';
import path from 'path';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Definición de rutas principales de la API
 */
app.use('/login', loginRoutes);
app.use('/registro', registroRoutes);
app.use('/storeSolucion', storeSolucionesRoute);
app.use('/storeBeneficios', storeBeneficiosRoute);
app.use('/storeProblemas', storeProblemasRoute);
app.use('/storeCaracteristicas', storeCaracteristicasRoute);
app.use('/menu', menuRoutes);
/** 
 * Ruta que muestra información sobre los endpoints disponibles
 */
app.get('/', (req, res) =>
{
    res.json({
        message: 'Bienvenido a la API de Tickets',
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
                        {method: 'GET', path: '/listCompleteBeneficios'},
                        {method: 'GET', path: '/listBeneficios/:id'},
                        {method:'POST', path: '/createBeneficio/:idSolucion' },
                        {method:'DELETE', path:'/deleteBeneficio/:idBeneficio'}
                    ]
                }
            },
            {
                storeProblemas:
                {
                    base: 'storeProblemas',
                    operations: [
                        {method: 'GET', path: '/listCompleteProblemas'},
                        {method: 'GET', path: '/listProblemas/:idSolucion'},
                        {method:'POST', path: '/createProblema/:idSolucion' },
                        {method:'DELETE', path:'/deleteProblema/:idProblema'}
                    ]
                }
            },
            {
                storeCaracteristicas:
                {
                    base: 'storeCaracteristicas',
                    operations: [
                        {method:'GET', path: '/listCompleteCaracteristicas'},
                        {method: 'GET', path: '/listCaracteristicas/:idSolucion'},
                        {method:'POST', path: '/createCaracteristicas/:idSolucion'}
                    ]
                }
            },
            {
                menu: {
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
