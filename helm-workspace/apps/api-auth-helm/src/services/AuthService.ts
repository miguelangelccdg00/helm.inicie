import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import bcrypt from 'bcryptjs';

class AuthService 
{
    async findUserByUsername(username: string) 
    {
        const [rows]: any = await pool.promise().query('SELECT * FROM store_users WHERE username = ?', [username]);
        return rows.length ? rows[0] : null;
    }

    async validatePassword(inputPassword: string, hashedPassword: string) 
    {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }

    async createUser(email: string, username: string, password: string) 
    {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = { email, username, pass: hashedPassword };
        const [result]: any = await pool.promise().query('INSERT INTO store_users SET ?', [nuevoUsuario]);

        return { id: result.insertId, ...nuevoUsuario };
    }
}

export default new AuthService();
