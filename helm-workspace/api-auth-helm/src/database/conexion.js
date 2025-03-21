const { error } = require('console');
const mysql = require ('mysql2');
require('dontev').config();

// Creacion de la conexion con la base de datos

const pool = mysql.createPool(
    {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'helm.inicie.es',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0    
});

pool.getConnection((error, connection) => {
    if (error) 
    {
        console.log('Error al conectar la base de datos ', error);
        if (error.code === 'PROTOCOLO_CONNECTION_LOST') 
        {
            console.log('La conexion con la base de datos fue cerrada');
        } 
        else if (error.code === 'ER_CON_COUNT_ERROR') 
        {
            console.log('La base de datos tiene muchas conexciones')            
        }
        else if (error.code === 'ECONNREFUSED')
        {
            console.log('La conexión fue rechazada');
        }
        else
        {
            return;
        }
    }
    else
    {
        console.log('Conexion a la base de datos exitosa')
        connection.release();
    }
})

module.exports = pool;
module.exports.promise = pool.promise();