import { pool } from '../../../api-shared-helm/src/databases/conexion.js';

class StoreCaracteristicasService
{
    /**
     * Crea un caracteristica y lo asocia con una solución existente.
     */
    async createCaracteristica({ description, titulo, idSolucion }) 
    {
        const conn = await pool.promise().getConnection();

        try 
        {
            await conn.beginTransaction();
            
            // Verifica si la solución existe antes de relacionarla
            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, 
                [idSolucion]
            );

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            // Inserta el caracteristica en la base de datos 
            const [caracteristicaResult]: any = await conn.query(
                `INSERT INTO storeCaracteristicas (description) VALUES (?)`, 
                [description]
            );

            const idCaracteristica = caracteristicaResult.insertId;

            // Relaciona el caracteristica con la solución
            await conn.query(
                `INSERT INTO storeSolucionesCaracteristicas (id_solucion, id_caracteristica) VALUES (?, ?)`, 
                [idSolucion, idCaracteristica]
            );

            // Actualiza los campos caracteristicaTitle y caracteristicaPragma en la solución
            await conn.query(
                `UPDATE storeSoluciones SET caracteristicasTitle = ?, caracteristicasPragma = ? WHERE id_solucion = ?`,
                [titulo, description, idSolucion]
            );

            await conn.commit();

            return { idCaracteristica, idSolucion, description, titulo };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al insertar la caracteristica:", error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

    /**
     * Asocia un caracteristica existente con una solución existente.
     */
    async asociarCaracteristica(idSolucion: number, idCaracteristica: number, titulo?: string) 
    {
        const conn = await pool.promise().getConnection();
        try 
        {
            await conn.beginTransaction();

            // Verifica si la solución existe
            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, 
                [idSolucion]
            );

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            // Verifica si el caracteristica existe y obtiene sus datos
            const [caracteristicaExiste]: any = await conn.query(
                `SELECT * FROM storeCaracteristicas WHERE id_caracteristica = ?`, 
                [idCaracteristica]
            );

            if (caracteristicaExiste.length === 0) 
            {
                throw new Error(`El caracteristica con id ${idCaracteristica} no existe.`);
            }

            // Verifica si la relación ya existe
            const [relacionExiste]: any = await conn.query(
                `SELECT * FROM storeSolucionesCaracteristicas WHERE id_solucion = ? AND id_caracteristica = ?`, 
                [idSolucion, idCaracteristica]
            );

            if (relacionExiste.length > 0) 
            {
                await conn.commit();
                return { idSolucion, idCaracteristica, message: 'La relación ya existía' };
            }

            // Crea la relación entre la solución y el caracteristica
            await conn.query(
                `INSERT INTO storeSolucionesCaracteristicas (id_solucion, id_caracteristica) VALUES (?, ?)`, 
                [idSolucion, idCaracteristica]
            );

            // Actualiza los campos caracteristicaTitle y caracteristicaPragma en la solución
            const caracteristica = caracteristicaExiste[0];
            await conn.query(
                `UPDATE storeSoluciones SET caracteristicasTitle = ?, caracteristicasPragma = ? WHERE id_solucion = ?`,
                [titulo || "caracteristica sin título", caracteristica.description, idSolucion]
            );

            await conn.commit();

            return { idSolucion, idCaracteristica, titulo, message: 'Relación creada con éxito' };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al asociar caracteristica:", error);
            throw error;
        } 
        finally 
        {
            conn.release();
        }
    }

    /**
     * Obtiene la lista de todos los caracteristicas registrados.
     */
    async listCaracteristicas() 
    {
        const [rows] = await pool.promise().query(`SELECT * FROM storeCaracteristicas`);
        return rows;
    }

    /**
     * Obtiene un problema específico por su ID.
     */
    async getCaracteristicaById(idCaracteristica: number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT * FROM storeCaracteristicas WHERE id_caracteristica = ?`, 
            [idCaracteristica]
        );
        return rows.length ? rows[0] : null;
    }

    /**
     * Obtiene las caracteristicas asociados a una solución específica.
     */
    async getByIdCaracteristicas(idSolucion: Number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT c.* 
            FROM storeCaracteristicas c
            JOIN storeSolucionesCaracteristicas sc ON c.id_caracteristica = sc.id_caracteristica
            WHERE sc.id_solucion = ?`, 
            [idSolucion]  
        );
        return rows;
    }

    async deleteCaracteristica(idCaracteristica: number): Promise<boolean>
    {
        const conn = await pool.promise().getConnection();

        try
        {
            await conn.beginTransaction();

            const [relacionResult]: any = await conn.query(
                'DELETE FROM storeSolucionesCaracteristicas WHERE id_caracteristica = ?',[idCaracteristica]);

            const [caracteristicaResult]: any = await conn.query(
                'DELETE FROM storeCaracteristicas WHERE id_caracteristica = ?',[idCaracteristica]);

            await conn.commit();

            return caracteristicaResult.affectedRows > 0;
        }
        catch (error)
        {
            await conn.rollback();
            console.error('Error al eliminar la caracteristica:', error);
            throw error;
        }
        finally
        {
            conn.release();
        }
    }

}

export default new StoreCaracteristicasService();