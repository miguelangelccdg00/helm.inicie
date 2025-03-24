const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), 'apps', 'api-shared-helm', 'claves.env') });

// Creación del pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
});

// Verificar conexión
pool.getConnection((error, connection) => 
{
    if (error)
    {
        console.error('Error al conectar la base de datos:', error);
        if (error.code === 'PROTOCOL_CONNECTION_LOST') 
        {
            console.error('La conexión con la base de datos fue cerrada');
        } 
        else if (error.code === 'ER_CON_COUNT_ERROR') 
        {
            console.error('La base de datos tiene muchas conexiones');
        } 
        else if (error.code === 'ECONNREFUSED') 
        {
            console.error('La conexión fue rechazada');
        }
    } 
    else 
    {
        console.log('Conexión a la base de datos exitosa');
        connection.release();
    }
});

// Exportación del pool y su versión con promesas
module.exports = pool.promise();