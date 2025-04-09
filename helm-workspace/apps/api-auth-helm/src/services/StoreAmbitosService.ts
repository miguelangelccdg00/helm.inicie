import { pool } from '../../../api-shared-helm/src/databases/conexion.js';

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
}

export default new StoreAmbitosService();
