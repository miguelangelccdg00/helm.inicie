import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import bcrypt from 'bcryptjs';

class AuthService 
{
    /** 
     * Busca un usuario en la base de datos por su nombre de usuario.
     * 
     * @param {string} username - Nombre de usuario del que se desea obtener los datos.
     * 
     * @returns {Promise<any | null>} Un objeto con los datos del usuario si existe, o null si no se encuentra.
     * 
     * @throws {Error} Si ocurre un error en la consulta a la base de datos.
     */
    async findUserByUsername(username: string) 
    {
        const [rows]: any = await pool.promise().query('SELECT id_user, email, username, pass FROM store_users WHERE username = ?', [username]);
        return rows.length ? rows[0] : null;
    }

    /** 
     * Valida si la contraseña ingresada coincide con la contraseña almacenada en la base de datos.
     * 
     * @param {string} inputPassword - Contraseña proporcionada por el usuario.
     * @param {string} hashedPassword - Contraseña encriptada almacenada en la base de datos.
     * 
     * @returns {Promise<boolean>} Devuelve un valor booleano que indica si las contraseñas coinciden.
     * 
     * @throws {Error} Si ocurre un error al comparar las contraseñas.
     */
    async validatePassword(inputPassword: string, hashedPassword: string) 
    {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }

    /** 
     * Crea un nuevo usuario en la base de datos con la contraseña encriptada.
     * 
     * @param {string} email - Correo electrónico del nuevo usuario.
     * @param {string} username - Nombre de usuario del nuevo usuario.
     * @param {string} password - Contraseña del nuevo usuario.
     * 
     * @returns {Promise<any>} Un objeto con los datos del nuevo usuario, incluido su ID generado.
     * 
     * @throws {Error} Si ocurre un error al insertar el usuario en la base de datos.
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
