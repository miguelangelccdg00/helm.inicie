const mysql = require('mysql2'); 
const path = require('path');
const { Client } = require('ssh2');
require('dotenv').config({ path: path.join(process.cwd(), 'apps', 'api-shared-helm', 'claves.env') });

// Configuración del túnel SSH
const sshConfig = {
    host: '51.15.200.151',
    port: 22,
    username: 'practicas',
    password: 'Normapro2025'
};

// Configuración de la base de datos
const dbConfig = {
    host: '127.0.0.1',  // Usar IP explícita en lugar de localhost para evitar problemas con IPv6
    port: 3307,         // Puerto del túnel SSH
    user: 'practicas',
    password: 'Normapro2025@',  // Contraseña correcta con el símbolo @
    database: 'store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0    
};

// Función para crear el túnel SSH y conectar a la base de datos
const crearTunelYConectar = () => {
    return new Promise((resolve, reject) => {
        const sshClient = new Client();
        
        sshClient.on('ready', () => {
            console.log('Conexión SSH establecida');
            
            // Crear el túnel desde el puerto local 3307 al puerto MySQL remoto 3306
            sshClient.forwardOut(
                '127.0.0.1',  // Dirección de origen local
                0,            // Puerto de origen local (0 = asignar automáticamente)
                'localhost',  // Host de destino (desde la perspectiva del servidor SSH)
                3306,         // Puerto de destino
                (err, stream) => {
                    if (err) {
                        console.error('Error al crear el túnel SSH:', err);
                        sshClient.end();
                        return reject(err);
                    }
                    
                    console.log('Túnel SSH establecido correctamente');
                    
                    // Modificar la configuración de la base de datos para usar el stream SSH
                    const poolConfig = {
                        ...dbConfig,
                        stream: stream  // Usar el stream SSH directamente
                    };
                    
                    // Crear el pool de conexiones MySQL
                    const pool = mysql.createPool(poolConfig);
                    
                    // Verificar la conexión a la base de datos
                    pool.getConnection((error, connection) => {
                        if (error) {
                            console.error('Error al conectar la base de datos:', error);
                            if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                                console.error('La conexión con la base de datos fue cerrada');
                            } else if (error.code === 'ER_CON_COUNT_ERROR') {
                                console.error('La base de datos tiene muchas conexiones');
                            } else if (error.code === 'ECONNREFUSED') {
                                console.error('La conexión fue rechazada');
                            }
                            sshClient.end();
                            return reject(error);
                        } 
                        
                        console.log('Conexión a la base de datos exitosa');
                        connection.release();
                        
                        // Guardar el cliente SSH en el pool para evitar que se cierre
                        pool.sshClient = sshClient;
                        
                        // Devolver el pool con promesas
                        resolve(pool.promise());
                    });
                }
            );
        });
        
        sshClient.on('error', (err) => {
            console.error('Error en la conexión SSH:', err);
            reject(err);
        });
        
        // Conectar al servidor SSH
        sshClient.connect(sshConfig);
    });
};

/// Exportar una promesa que se resuelve con el pool de conexiones
const poolPromise = crearTunelYConectar().catch(err => {
    console.error('Error al crear el túnel y conectar a la base de datos:', err);
    process.exit(1); // Salir si no podemos conectar
});

// Exportar directamente el objeto pool.promise() para mantener compatibilidad con el código existente
module.exports = poolPromise;