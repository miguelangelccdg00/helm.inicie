import {pool} from '../database/conexion.js';
import { Request, Response } from 'express';
import { usuario } from '../models/usuario.js';

class loginController 
{
    constructor() {}

    loginUsuario = async (req: Request, res: Response): Promise<void> =>
    {
        try 
        {

            const loginUsuario: usuario = req.body;
            const [result] = await pool.promise().query('INSERT INTO usuario SET ?', [loginUsuario]);
            res.status(202).json({message:'Usuario logueado con exito'});
            return;
        } 
        catch (error) 
        {
            console.error('Ha ocurrido un error al loguear el usuario: ', error);
            res.status(500).json({message:'Error al loguear el usuario '});
        }
    }

}