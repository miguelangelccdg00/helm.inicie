import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import bcrypt from 'bcryptjs';

class AuthService 
{
    /**
     * Busca un usuario en la base de datos por su nombre de usuario
     */
    async findUserByUsername(username: string) 
    {
        const [rows]: any = await pool.promise().query('SELECT * FROM store_users WHERE username = ?', [username]);
        return rows.length ? rows[0] : null;
    }

    /**
     * Valida si la contraseña ingresada coincide con la almacenada 
     */
    async validatePassword(inputPassword: string, hashedPassword: string) 
    {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }

    /**
     * Crea un nuevo usuario en la base de datos
     */
    async createUser(email: string, username: string, password: string) 
    {
        // Genera un salt para encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crea un objeto de usuario con la contraseña encriptada
        const nuevoUsuario = { email, username, pass: hashedPassword };

        // Inserta el usuario en la base de datos y obtiene el ID generado
        const [result]: any = await pool.promise().query('INSERT INTO store_users SET ?', [nuevoUsuario]);

        return { id: result.insertId, ...nuevoUsuario };
    }
}

export default new AuthService();
