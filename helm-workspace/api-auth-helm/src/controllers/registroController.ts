import { pool } from '../../../api-shared-helm/src/database/conexion.js';
import { Request, Response } from 'express';
import { usuario } from '../models/usuario.js';

class registrarController
{
    constructor(){}

    registrarUsuario = async (req: Request, res: Response): Promise<void> =>
    {
        try 
        {
            const nuevoUsuario: usuario = req.body;
            const [result] = await pool.promise().query('INSERT INTO usuario SET ?', [nuevoUsuario]);
            res.status(201).json({message:'Usuario creado', id: nuevoUsuario.nombreUsuario})
            return;
        } 
        catch (error) 
        {
            console.error('Ha ocurrido un error al crear el usuario: ', error);
            res.status(500).json({message:'Error al crear el usuario'});
        }
    }
}

module.exports = new registrarController();