import { pool } from '../../../api-shared-helm/src/databases/conexion.js';
import { StoreAmbitos } from '../models/storeAmbitos';
import { storeSolucionesAmbitos } from '../models/storeSolucionesAmbitos.js';

class StoreAmbitosService 
{
    /**
     * Crea un ámbito y lo asocia con una solución existente, copiando todos los datos de la solución a la tabla storeSolucionesAmbitos.
     */
    async createAmbito({ description, textoweb, prefijo, slug, idSolucion }) 
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

            // Inserta el nuevo ámbito
            const [ambitoResult]: any = await conn.query(
                `INSERT INTO storeAmbitos (description, textoweb, prefijo, slug) VALUES (?, ?, ?, ?)`,
                [description, textoweb, prefijo, slug]
            );

            const idAmbito = ambitoResult.insertId;

            // Obtener los datos de la solución
            const [solucionRows]: any = await conn.query(
                `SELECT 
                    description, title, subtitle, icon, titleweb, slug, multimediaUri, multimediaTypeId,
                    problemaTitle, problemaPragma, solucionTitle, solucionPragma,
                    caracteristicasTitle, caracteristicasPragma, casosdeusoTitle, casosdeusoPragma,
                    firstCtaTitle, firstCtaPragma, secondCtaTitle, secondCtaPragma,
                    titleBeneficio AS beneficiosTitle, beneficiosPragma
                FROM storeSoluciones
                WHERE id_solucion = ?`,
                [idSolucion]
            );

            if (solucionRows.length === 0) 
            {
                throw new Error(`No se pudo obtener los datos de la solución con id ${idSolucion}`);
            }

            const s = solucionRows[0];

            // Insertar en storeSolucionesAmbitos
            await conn.query(
                `INSERT INTO storeSolucionesAmbitos (
                    id_solucion, id_ambito,
                    description, title, subtitle, icon, titleweb, slug, multimediaUri, multimediaTypeId,
                    problemaTitle, problemaPragma, solucionTitle, solucionPragma,
                    caracteristicasTitle, caracteristicasPragma, casosdeusoTitle, casosdeusoPragma,
                    firstCtaTitle, firstCtaPragma, secondCtaTitle, secondCtaPragma,
                    beneficiosTitle, beneficiosPragma
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    idSolucion, idAmbito,
                    s.description, s.title, s.subtitle, s.icon, s.titleweb, s.slug, s.multimediaUri, s.multimediaTypeId,
                    s.problemaTitle, s.problemaPragma, s.solucionTitle, s.solucionPragma,
                    s.caracteristicasTitle, s.caracteristicasPragma, s.casosdeusoTitle, s.casosdeusoPragma,
                    s.firstCtaTitle, s.firstCtaPragma, s.secondCtaTitle, s.secondCtaPragma,
                    s.beneficiosTitle, s.beneficiosPragma
                ]
            );

            await conn.commit();

            return {
                idAmbito,
                idSolucion,
                message: 'Ámbito creado y solución relacionada exitosamente con datos completos.'
            };

        } 
        catch (error)
        {
            await conn.rollback();
            console.error("Error al insertar el ámbito:", error);
            throw error;
        } finally {
            conn.release();
        }
    }

    async asociarAmbito(idSolucion: number, idAmbito: number) 
    {
        const conn = await pool.promise().getConnection();
        
        try 
        {
            await conn.beginTransaction();

            const [solucionExiste]: any = await conn.query(
                `SELECT id_solucion FROM storeSoluciones WHERE id_solucion = ?`, 
                [idSolucion]
            );

            if (solucionExiste.length === 0) 
            {
                throw new Error(`La solución con id ${idSolucion} no existe.`);
            }

            const [ambitosExiste]: any = await conn.query(
                `SELECT * FROM storeAmbitos WHERE id_ambito = ?`, 
                [idAmbito]
            );

            if (ambitosExiste.length === 0) 
            {
                throw new Error(`El ámbito con id ${idAmbito} no existe.`);
            }

            const [relacionExiste]: any = await conn.query(
                `SELECT * FROM storeSolucionesAmbitos WHERE id_solucion = ? AND id_ambito = ?`, 
                [idSolucion, idAmbito]
            );

            if (relacionExiste.length > 0) 
            {
                await conn.commit();
                return { idSolucion, idAmbito, message: 'La relación ya existía' };
            }

            await conn.query(
                `INSERT INTO storeSolucionesAmbitos (id_solucion, id_ambito) VALUES (?, ?)`, 
                [idSolucion, idAmbito]
            );

            await conn.commit();

            return { idSolucion, idAmbito, message: 'Relación creada con éxito' };
        } 
        catch (error) 
        {
            await conn.rollback();
            console.error("Error al asociar ámbito:", error);
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
    async listAmbitos() 
    {
        const [rows] = await pool.promise().query(`SELECT * FROM storeAmbitos`);
        return rows;
    }

    /**
     * Obtiene un problema específico por su ID.
     */
    async getAmbitoById(idAmbito: number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT * FROM storeAmbitos WHERE id_ambito = ?`, [idAmbito]);
        return rows.length ? rows[0] : null;
    }

    /**
     * Obtiene los ambitos asociados a una solución específica.
     */
    async getByIdAmbitos(idSolucion: Number) 
    {
        const [rows] = await pool.promise().query(
            `SELECT a.* 
            FROM storeAmbitos a
            JOIN storeSolucionesAmbitos sc ON a.id_ambito = sc.id_ambito
            WHERE sc.id_solucion = ?`, 
            [idSolucion]  
        );
        return rows;
    }

    async update(idSolucion: number,idAmbito: number ,updateData: Partial<storeSolucionesAmbitos>) 
    {
        await pool.promise().query('UPDATE storeSolucionesAmbitos SET ? WHERE id_ambito = ? AND id_solucion = ?', [updateData, idAmbito, idSolucion]);
        return { message: 'Ámbito actualizado' };
    }

    async deleteAmbito(idAmbito: number): Promise<boolean>
    {
        const conn = await pool.promise().getConnection();

        try
        {
            await conn.beginTransaction();

            const [relacionResult]: any = await conn.query(
                'DELETE FROM storeSolucionesAmbitos WHERE id_ambito = ?',[idAmbito]);

            const [ambitoResult]: any = await conn.query(
                'DELETE FROM storeAmbitos WHERE id_ambito = ?',[idAmbito]);

            await conn.commit();

            return ambitoResult.affectedRows > 0;
        }
        catch (error)
        {
            await conn.rollback();
            console.error('Error al eliminar el ambito:', error);
            throw error;
        }
        finally
        {
            conn.release();
        }
    }

}

export default new StoreAmbitosService();
