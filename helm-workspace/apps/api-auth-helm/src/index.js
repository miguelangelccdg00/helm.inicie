import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import registroRoutes from './routes/RegistroRoute';
import loginRoutes from './routes/LoginRoute';
import storeSolucionesRoute from './routes/StoreSolucionesRoute';
import menuRoutes from './routes/MenuRoute';
import path from 'path';
 
const app = express();
 
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use('/login',loginRoutes);
app.use('/registro',registroRoutes);
app.use('/storeSolucion',storeSolucionesRoute);
app.use('/menu', menuRoutes);
 
app.get('/', (req, res) =>
{
    res.json({ message: 'Bienvenido a la API de Tickets',
        endpoints: [{
            login:
            {
                base: 'login',
                operations:[
                    { method: 'POST', path: '/loginUsuario' }
                ]                        
            },
            registro:
            {
                base: 'registro',
                operations:[
                    { method: 'POST', path: '/registrarUsuario' }
                ]
            },
            storeSolucion:
            {
                base: 'storeSolucion',
                operations:[
                    { method: 'GET', path: '/listStoreSoluciones' },
                    { method: 'GET', path: '/listIdStoreSoluciones/id' },
                    { method: 'PUT', path: '/modifyStoreSoluciones/id' }
                ]
            },
            menu:
            {
                base: 'menu',
                operations:[
                    { method: 'GET', path: '/items' },
                    { method: 'GET', path: '/submenus' }
                ]
            }            
        }]
    })
})

export default app;