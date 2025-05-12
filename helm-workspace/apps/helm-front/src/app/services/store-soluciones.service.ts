import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { StoreSoluciones, UpdateStoreSolucionResponse, DeleteSolucionResponse } from '@modelos-shared/storeSoluciones'
import { StoreBeneficios, CreateBeneficioResponse, DeleteBeneficioResponse } from '@modelos-shared/storeBeneficios';
import { StoreProblemas, CreateProblemaResponse, DeleteProblemaResponse } from '@modelos-shared/storeProblemas';
import { StoreCaracteristicas, CreateCaracteristicaResponse, DeleteCaracteristicaResponse } from '@modelos-shared/storeCaracteristicas';
import { StoreAmbitos, CreateAmbitoResponse, DeleteAmbitoResponse } from '@modelos-shared/storeAmbitos';
import { SolucionAmbito, DeleteSolucionAmbitoResponse } from '@modelos-shared/solucionAmbito';
import { StoreSectores, CreateSectorResponse, DeleteSectorResponse } from '@modelos-shared/storeSectores';
import { SolucionSector, DeleteSolucionSectorResponse } from '@modelos-shared/solucionSector';
import { SolucionAmbitoSector } from '@modelos-shared/solucionAmbitoSector';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class StoreSolucionesService {

  private solucionesUrl = 'http://localhost:3009/storeSolucion';
  private beneficiosUrl = 'http://localhost:3009/storeBeneficios';
  private problemasUrl = 'http://localhost:3009/storeProblemas';
  private caracteristicasUrl = 'http://localhost:3009/storeCaracteristicas';
  private ambitosUrl = 'http://localhost:3009/storeAmbitos';
  private sectoresUrl = 'http://localhost:3009/storeSectores';

  constructor(private https: HttpClient) { }

  /* StoreSoluciones */

  /* Obtiene todas las store soluciones */
  getStoreSoluciones(): Observable<StoreSoluciones[]> {
    const url = `${this.solucionesUrl}/listStoreSoluciones`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones[]>(url, { headers });
  }

  /* Obtiene una store solucion por su id */
  getStoreSolucionById(id: number): Observable<StoreSoluciones> {
    const url = `${this.solucionesUrl}/listIdStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones>(url, { headers });
  }

  /* Actualiza una store solucion */
  updateStoreSolucion(id: number, solucion: StoreSoluciones): Observable<UpdateStoreSolucionResponse> {
    const url = `${this.solucionesUrl}/modifyStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const solucionToUpdate: any = {
      id_solucion: solucion.id_solucion,
      description: solucion.description,
      title: solucion.title,
      subtitle: solucion.subtitle,
      icon: solucion.icon,
      slug: solucion.slug,
      titleweb: solucion.titleweb,
      multimediaUri: solucion.multimediaUri,
      multimediaTypeId: solucion.multimediaTypeId,
      
      problemaTitle: solucion.problemaTitle,
      problemaPragma: solucion.problemaPragma,
      solucionTitle: solucion.solucionTitle,
      solucionPragma: solucion.solucionPragma,
      caracteristicasTitle: solucion.caracteristicasTitle,
      caracteristicasPragma: solucion.caracteristicasPragma,
      casosdeusoTitle: solucion.casosdeusoTitle,
      casosdeusoPragma: solucion.casosdeusoPragma,
      firstCtaTitle: solucion.firstCtaTitle,
      firstCtaPragma: solucion.firstCtaPragma,
      secondCtaTitle: solucion.secondCtaTitle,
      secondCtaPragma: solucion.secondCtaPragma,
      titleBeneficio: solucion.titleBeneficio,
      beneficiosPragma: solucion.beneficiosPragma
    };

    console.log('Objeto completo a enviar:', solucionToUpdate);

    return this.https.put<UpdateStoreSolucionResponse>(url, solucionToUpdate, { headers })
      .pipe(
        map(response => {
          console.log('Respuesta del servidor:', response);
          return response;
        })
      );
  }

  /* Elimina una store solucion por su id */
  deleteStoreSolucion(id: number): Observable<DeleteSolucionResponse> {
    const url = `${this.solucionesUrl}/deleteSolucion/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSolucionResponse>(url, { headers });
  }

  /* Beneficios */

  /* Modifica un beneficio */
  modifyBeneficio(idBeneficio: number, beneficio: StoreBeneficios): Observable<StoreBeneficios> {
    const url = `${this.beneficiosUrl}/modifyStoreBeneficio/${idBeneficio}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const beneficioToUpdate = {
      description: beneficio.description
    };

    return this.https.put<StoreBeneficios>(url, beneficioToUpdate, { headers });
  }

  /* Obtiene los beneficios de una solución por su id */
  getBeneficiosBySolucion(idSolucion: number): Observable<StoreBeneficios[]> {
    const url = `${this.beneficiosUrl}/listBeneficios/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.info('ℹ️ Consultando beneficios asociados...');
    
    return this.https.get<StoreBeneficios[]>(url, { headers }).pipe(
      map(beneficios => {
        if (beneficios && beneficios.length > 0) {
          console.log('✅ Beneficios recuperados correctamente');
        } else {
          console.info('ℹ️ No hay beneficios asociados');
        }
        return Array.isArray(beneficios) ? beneficios : [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin beneficios para mostrar');
        } else {
          console.warn('⚠️ Error al consultar beneficios');
        }
        return of([]);
      })
    );
  }


  /* Obtiene todos los beneficios */
  getAllBeneficios(): Observable<StoreBeneficios[]> {
    const url = `${this.beneficiosUrl}/listCompleteBeneficios`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/plain, */*');
    
    console.info('ℹ️ Consultando listado completo de beneficios...');
    
    return this.https.get<StoreBeneficios[]>(url, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        if (response.body && response.body.length > 0) {
          console.log('✅ Listado de beneficios recuperado correctamente');
        } else {
          console.info('ℹ️ No hay beneficios disponibles en el sistema');
        }
        return response.body || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin beneficios para mostrar');
        } else {
          console.warn('⚠️ Error al consultar el listado de beneficios:', error.message);
        }
        return of([]);
      })
    );
  }

  /* Crea un beneficio y lo asocia a una solución */
  createBeneficio(idSolucion: number, beneficio: StoreBeneficios): Observable<CreateBeneficioResponse> {
    const url = `${this.beneficiosUrl}/createBeneficio/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const beneficioToCreate = {
      titulo: beneficio.titulo,
      description: beneficio.description
    };

    return this.https.post<CreateBeneficioResponse>(url, beneficioToCreate, { headers });
  }

  /* Elimina un beneficio por su id */
  deleteBeneficio(idBeneficio: number): Observable<DeleteBeneficioResponse> {
    const url = `${this.beneficiosUrl}/deleteBeneficio/${idBeneficio}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteBeneficioResponse>(url, { headers });
  }

  /* Asocia un beneficio a una solución a partir de sus id */
  asociarBeneficioASolucion(idSolucion: number, idBeneficio: number): Observable<any> {
    const url = `${this.beneficiosUrl}/asociarBeneficio`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_beneficio: idBeneficio
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  /* Problemas */

  /* Modifica un problema a partir de su id */
  modifyProblema(idProblema: number, problema: StoreProblemas): Observable<StoreProblemas> {
    const url = `${this.problemasUrl}/modifyStoreProblema/${idProblema}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const problemaToUpdate = {
      description: problema.description
    };
  
    return this.https.put<StoreProblemas>(url, problemaToUpdate, { headers });
  }

  /* Asocia un problema a una solución a partir de sus id  */
  asociarProblemaASolucion(idSolucion: number, idProblema: number): Observable<any> {
    const url = `${this.problemasUrl}/asociarProblema`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_problema: idProblema
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  /* Crea un problema y lo asocia a una solución */
  createProblema(idSolucion: number, problema: StoreProblemas): Observable<CreateProblemaResponse> {
    const url = `${this.problemasUrl}/createProblema/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const problemaToCreate = {
      titulo: problema.titulo,
      description: problema.description
    };

    return this.https.post<CreateProblemaResponse>(url, problemaToCreate, { headers });
  }

  /* Elimina un problema por su id */
  deleteProblema(idProblema: number): Observable<DeleteProblemaResponse> {
    const url = `${this.problemasUrl}/deleteProblema/${idProblema}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteProblemaResponse>(url, { headers });
  }

  /* Obtiene los problemas de una solución a partir del id de esta */
  getProblemasBySolucion(idSolucion: number): Observable<StoreProblemas[]> {
    const url = `${this.problemasUrl}/listProblemas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.info('ℹ️ Consultando problemas asociados...');
    
    return this.https.get<StoreProblemas[]>(url, { headers }).pipe(
      map(problemas => {
        if (problemas && problemas.length > 0) {
          console.log('✅ Problemas recuperados correctamente');
        } else {
          console.info('ℹ️ No hay problemas asociados');
        }
        return Array.isArray(problemas) ? problemas : [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin problemas para mostrar');
        } else {
          console.warn('⚠️ Error al consultar problemas');
        }
        return of([]);
      })
    );
  }

  /* Obtiene todos los problemas */
  getAllProblemas(): Observable<StoreProblemas[]> {
    const url = `${this.problemasUrl}/listCompleteProblemas`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/plain, */*');
    
    console.info('ℹ️ Consultando listado completo de problemas...');
    
    return this.https.get<StoreProblemas[]>(url, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        if (response.body && response.body.length > 0) {
          console.log('✅ Listado de problemas recuperado correctamente');
        } else {
          console.info('ℹ️ No hay problemas disponibles en el sistema');
        }
        return response.body || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin problemas para mostrar');
        } else {
          console.warn('⚠️ Error al consultar el listado de problemas:', error.message);
        }
        return of([]);
      })
    );
  }

  /* Actualiza un problema y lo asocia a una solución a partir del id de esta */
  updateProblemaAndAsociar(idSolucion: number, problema: StoreProblemas): Observable<any> {
    return this.getStoreSolucionById(idSolucion).pipe(
      switchMap(solucion => {
        solucion.problemaTitle = problema.titulo || solucion.problemaTitle;
        solucion.problemaPragma = problema.description;

        console.log('Actualizando problemaPragma a:', problema.description);

        return this.updateStoreSolucion(idSolucion, solucion).pipe(
          switchMap(response => {
            if (problema.id_problema) {
              return this.asociarProblemaASolucion(idSolucion, problema.id_problema);
            }
            return new Observable(observer => {
              observer.next({ message: 'Problema actualizado sin asociación' });
              observer.complete();
            });
          })
        );
      })
    );
  }

  /* Características */

  /* Modifica una característica */
  modifyCaracteristica(idCaracteristica: number, caracteristica: StoreCaracteristicas): Observable<StoreCaracteristicas> {
    const url = `${this.caracteristicasUrl}/modifyStoreCaracteristica/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const caracteristicaToUpdate = {
      description: caracteristica.description
    };

    return this.https.put<StoreCaracteristicas>(url, caracteristicaToUpdate, { headers });
  }

  /* Crea una característica y lo asocia a una solución */
  createCaracteristica(idSolucion: number, caracteristica: StoreCaracteristicas): Observable<CreateCaracteristicaResponse> {
    const url = `${this.caracteristicasUrl}/createCaracteristicas/${idSolucion}`;
    const headers = { 'Content-Type': 'application/json' };
  
    const { titulo, description } = caracteristica;
    console.log('Valores originales a guardar:', { title: titulo, description });
  
    return this.https.post<CreateCaracteristicaResponse>(url, { titulo, description }, { headers }).pipe(
      switchMap(response =>
        this.getStoreSolucionById(idSolucion).pipe(
          switchMap(solucion => {
            solucion.caracteristicasTitle = titulo || solucion.caracteristicasTitle;
            solucion.caracteristicasPragma = description;
  
            console.log('Actualizando solución después de crear característica:', {
              caracteristicasTitle: titulo,
              caracteristicasPragma: description
            });
  
            return this.updateStoreSolucion(idSolucion, solucion).pipe(
              map(() => ({
                ...response,
                caracteristica: {
                  ...response.caracteristica,
                  titulo,
                  description
                }
              }))
            );
          })
        )
      )
    );
  }  

  /* Elimina una característica por su id */
  deleteCaracteristica(idCaracteristica: number): Observable<DeleteCaracteristicaResponse> {
    const url = `${this.caracteristicasUrl}/deleteCaracteristicas/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteCaracteristicaResponse>(url, { headers });
  }

  /* Obtiene las características de una solución a partir de el id de esta */
  getCaracteristicasBySolucion(idSolucion: number): Observable<StoreCaracteristicas[]> {
    const url = `${this.caracteristicasUrl}/listCaracteristicas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.info('ℹ️ Consultando características asociadas...');
    
    return this.https.get<StoreCaracteristicas[]>(url, { headers }).pipe(
      map(caracteristicas => {
        if (caracteristicas && caracteristicas.length > 0) {
          console.log('✅ Características recuperadas correctamente');
        } else {
          console.info('ℹ️ No hay características asociadas');
        }
        return Array.isArray(caracteristicas) ? caracteristicas : [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin características para mostrar');
        } else {
          console.warn('⚠️ Error al consultar características');
        }
        return of([]);
      })
    );
  }

  /* Obtiene todas las características */
  getAllCaracteristicas(): Observable<StoreCaracteristicas[]> {
    const url = `${this.caracteristicasUrl}/listCompleteCaracteristicas`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/plain, */*');
    
    console.info('ℹ️ Consultando listado completo de características...');
    
    return this.https.get<StoreCaracteristicas[]>(url, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        if (response.body && response.body.length > 0) {
          console.log('✅ Listado de características recuperado correctamente');
        } else {
          console.info('ℹ️ No hay características disponibles en el sistema');
        }
        return response.body || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin características para mostrar');
        } else {
          console.warn('⚠️ Error al consultar el listado de características:', error.message);
        }
        return of([]);
      })
    );
  }

  /* Asocia una característica a una solución a partir de sus id */
  asociarCaracteristicaASolucion(idSolucion: number, idCaracteristica: number, titulo?: string): Observable<any> {
    const url = `${this.caracteristicasUrl}/asociarCaracteristica`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_caracteristica: idCaracteristica
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  /* Obtiene una característica por su id */
  getCaracteristicaById(idCaracteristica: number): Observable<StoreCaracteristicas> {
    const url = `${this.caracteristicasUrl}/getCaracteristica/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreCaracteristicas>(url, { headers });
  }

  /* Actualiza una característica y la asocia a una solución a partir de el id de esta */
  updateCaracteristicaAndAsociar(idSolucion: number, caracteristica: StoreCaracteristicas): Observable<any> {
    const actualizarCaracteristicas = (solucion: any): Observable<any> => {
      solucion.caracteristicasTitle = caracteristica.titulo || solucion.caracteristicasTitle;
      solucion.caracteristicasPragma = caracteristica.description;
      
      console.log('Actualizando caracteristicasTitle a:', caracteristica.titulo);
      console.log('Actualizando caracteristicasPragma a:', caracteristica.description);
      
      return this.updateStoreSolucion(idSolucion, solucion);
    };
  
    if (caracteristica.id_caracteristica) {
      return this.asociarCaracteristicaASolucion(idSolucion, caracteristica.id_caracteristica).pipe(
        switchMap(() => this.getStoreSolucionById(idSolucion).pipe(switchMap(actualizarCaracteristicas)))
      );
    } else {
      return this.getStoreSolucionById(idSolucion).pipe(
        switchMap(actualizarCaracteristicas),
        map(response => ({
          message: 'Característica actualizada sin asociación',
          caracteristicasTitle: caracteristica.titulo,
          caracteristicasPragma: caracteristica.description
        }))
      );
    }
  }  

  /* Ámbitos */

  /* Obtención de ámbitos por solución específica de su ID */
  getAmbitosBySolucion(idSolucion: number): Observable<StoreAmbitos[]> {
    const url = `${this.ambitosUrl}/listAmbitos/${idSolucion}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/plain, */*');
    
    console.info('ℹ️ Consultando ámbitos asociados...');
    
    return this.https.get<StoreAmbitos[]>(url, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        if (response.body && response.body.length > 0) {
          console.log('✅ Ámbitos recuperados correctamente');
        } else {
          console.info('ℹ️ No hay ámbitos asociados');
        }
        return response.body || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin ámbitos para mostrar');
        } else {
          console.warn('⚠️ Error al consultar ámbitos');
        }
        return of([]);
      })
    );
  }

  /* Obtiene todos los ámbitos */
  getAllAmbitos(): Observable<StoreAmbitos[]> {
    const url = `${this.ambitosUrl}/listCompleteAmbitos`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/plain, */*');
    
    console.info('ℹ️ Consultando listado completo de ámbitos...');
    
    return this.https.get<StoreAmbitos[]>(url, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        if (response.body && response.body.length > 0) {
          console.log('✅ Listado de ámbitos recuperado correctamente');
        } else {
          console.info('ℹ️ No hay ámbitos disponibles en el sistema');
        }
        return response.body || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin ámbitos para mostrar');
        } else {
          console.warn('⚠️ Error al consultar el listado de ámbitos:', error.message);
        }
        return of([]);
      })
    );
  }

  /* Crea un ámbito y lo asocia a una solución*/
  createAmbito(idSolucion: number, ambito: StoreAmbitos): Observable<CreateAmbitoResponse> {
    const url = `${this.ambitosUrl}/createAmbito/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const ambitoToCreate = {
      description: ambito.description,
      textoweb: ambito.textoweb,
      prefijo: ambito.prefijo,
      slug: ambito.slug
    };

    return this.https.post<CreateAmbitoResponse>(url, ambitoToCreate, { headers });
  }

  /* Asocia un ámbito a una solución a partir del id de esta */
  asociarAmbitoASolucion(idSolucion: number, idAmbito: number): Observable<any> {
    const url = `${this.ambitosUrl}/asociarAmbito`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_ambito: idAmbito
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  /* Modifica un ámbito a partir de su id y el de la solución en la que se está realizando la modificación */
  modifyAmbito(idSolucion: number, idAmbito: number, ambito: StoreAmbitos): Observable<StoreAmbitos> {
    const url = `${this.ambitosUrl}/modifyAmbitos/${idSolucion}/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const ambitoToUpdate = {
      description: ambito.description,
      textoweb: ambito.textoweb,
      prefijo: ambito.prefijo,
      slug: ambito.slug
    };

    return this.https.put<StoreAmbitos>(url, ambitoToUpdate, { headers });
  }

  /* Elimina un ámbito a partir de su id */
  deleteAmbito(idAmbito: number): Observable<DeleteAmbitoResponse> {
    const url = `${this.ambitosUrl}/deleteAmbito/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteAmbitoResponse>(url, { headers });
  }

  /* Lista los ámbitos de una solución a partir de su id */
  listAmbitos(idSolucion: number): Observable<SolucionAmbito[]> {
    const url = `${this.ambitosUrl}/listAmbitos/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.info('ℹ️ Solicitando ámbitos por solución:', url);
    
    return this.https.get<SolucionAmbito[]>(url, { headers }).pipe(
      map(response => {
        if (!response || response.length === 0) {
          console.info(`ℹ️ No se encontraron ámbitos para la solución ${idSolucion}`);
        } else {
          console.log('✅ Ámbitos recuperados correctamente:', response);
        }
        return response;
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info(`ℹ️ No se encontraron ámbitos para la solución ${idSolucion}`);
        } else {
          console.warn('⚠️ Error al obtener ámbitos por solución:', error);
        }
        return of([]);
      })
    );
  }

  /* Modifica la solución de un ámbito a partir de sus id */
  modifySolucionAmbito(idSolucion: number, idAmbito: number, ambito: StoreAmbitos): Observable<SolucionAmbito> {
    const url = `${this.ambitosUrl}/modifyAmbitos/${idSolucion}/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const solucionAmbitoToUpdate = {
      id_solucion: idSolucion,
      id_ambito: idAmbito,
      description: ambito.description,
      title: ambito.description,
      subtitle: ambito.description,
      icon: ambito.description,
      titleweb: ambito.description,
      slug: ambito.slug,
      multimediaUri: ambito.description,
      multimediaTypeId: ambito.description,
      problemaTitle: ambito.description,
      problemaPragma: ambito.description,
      solucionTitle: ambito.description,
      solucionPragma: ambito.description,
      caracteristicasTitle: ambito.description,
      caracteristicasPragma: ambito.description,
      casosdeusoTitle: ambito.description,
      casosdeusoPragma: ambito.description,
      firstCtaTitle: ambito.description,
      firstCtaPragma: ambito.description,
      secondCtaTitle: ambito.description,
      secondCtaPragma: ambito.description,
      beneficiosTitle: ambito.description,
      beneficiosPragma: ambito.description
    };

    return this.https.put<SolucionAmbito>(url, solucionAmbitoToUpdate, { headers });
  }

  /* Elimina una solución de un ámbito por sus id */
  deleteSolucionAmbito(idSolucion: number, idAmbito: number): Observable<DeleteSolucionAmbitoResponse> {
    const url = `http://localhost:3009/storeSolucion/removeAmbitoFromSolucion/${idSolucion}/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSolucionAmbitoResponse>(url, { headers });
  }

  updateSolucionAmbitos(idSolucion: number, solucionAmbito: SolucionAmbito): Observable<any> {
    const url = `${this.ambitosUrl}/modifySolucionAmbitos/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.log('⌛ Actualizando ámbito de la solución:', {
      url,
      idSolucion,
      solucionAmbito
    });
  
    return this.https.put<any>(url, solucionAmbito, { headers }).pipe(
      map(response => {
        console.log('✅ Ámbito actualizado correctamente:', response);
        return response;
      }),
      catchError(error => {
        if (error.status === 404) {
          console.error('❌ Ruta no encontrada:', url);
          console.error('Detalles del error:', error);
        } else {
          console.error('❌ Error al actualizar ámbito:', error);
        }
        return throwError(() => new Error(`Error al actualizar ámbito: ${error.message}`));
      })
    );
  }

  /* Sectores */

  /* Crea un sector y lo asocia a una solución*/
  createSector(idSolucion: number, sector: StoreSectores): Observable<CreateSectorResponse> {
    const url = `${this.sectoresUrl}/createSectores/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const sectorToCreate = {
      description: sector.description,
      textoweb: sector.textoweb,
      prefijo: sector.prefijo,
      slug: sector.slug,
      descriptionweb: sector.descriptionweb,
      titleweb: sector.titleweb,
      backgroundImage: sector.backgroundImage,
    };

    return this.https.post<CreateSectorResponse>(url, sectorToCreate, { headers });
  }

  getAllSectores(): Observable<StoreSectores[]> {
    const url = `${this.sectoresUrl}/listCompleteSectores`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    };
  
    console.info('ℹ️ Consultando listado completo de sectores...');
  
    return this.https.get<StoreSectores[]>(url, { headers }).pipe(
      tap(sectores => {
        if (sectores.length > 0) {
          console.log('✅ Listado de sectores recuperado correctamente');
        } else {
          console.info('ℹ️ No hay sectores disponibles en el sistema');
        }
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin sectores para mostrar');
        } else {
          console.warn('⚠️ Error al consultar el listado de sectores:', error.message);
        }
        return of([]);
      })
    );
  }  

  /* Obtención de sectores por solución específica de su ID */
  getSectoresBySolucion(idSolucion: number): Observable<StoreSectores[]> {
    const url = `${this.sectoresUrl}/listSectores/${idSolucion}`;
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/plain, */*');
    
    console.info('ℹ️ Consultando sectores asociados...');
    
    return this.https.get<StoreSectores[]>(url, { 
      headers,
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(response => {
        if (response.body && response.body.length > 0) {
          console.log('✅ Sectores recuperados correctamente');
        } else {
          console.info('ℹ️ No hay sectores asociados');
        }
        return response.body || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin sectores para mostrar');
        } else {
          console.warn('⚠️ Error al consultar sectores');
        }
        return of([]);
      })
    );
  }

  /* Obtención de sectores por solución específica de su ID */
  listSectores(idSolucion: number): Observable<SolucionSector[]> {
    const url = `${this.sectoresUrl}/listSectores/${idSolucion}`;
    const headers = { 'Content-Type': 'application/json' };
  
    console.info('ℹ️ Consultando sectores de la solución:', idSolucion);
  
    return this.https.get<any[]>(url, { headers }).pipe(
      map(response => {
        const sectoresArray = Array.isArray(response) ? response : [response];
  
        return sectoresArray.map(sector => ({
          id_solucion: sector.id_solucion || idSolucion,
          id_sector: sector.id_sector,
          descalternativa: sector.dawdawd || sector.descalternativa || '',
          textoalternativo: sector.textoalternativo || sector.null || '' 
        }));
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info(`ℹ️ No se encontraron sectores para consultar`);
        } else {
          console.warn('⚠️ Error en la consulta de sectores:', error);
        }
        return of([]);
      })
    );
  }  

  /* Asociar un sector existente a una solución */
  asociarSectorASolucion(idSolucion: number, idSector: number): Observable<any> {
    const url = `${this.sectoresUrl}/asociarSectores`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_sector: idSector
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  /* Modificación de un sector de una solución específica */
  modifySector(idSolucion: number, idSector: number, sector: StoreSectores): Observable<StoreSectores> {
    const url = `${this.sectoresUrl}/modifySectores/${idSolucion}/${idSector}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const sectorToUpdate = {
      description: sector.description,
      textoweb: sector.textoweb,
      prefijo: sector.prefijo,
      slug: sector.slug,
      descriptionweb: sector.descriptionweb,
      titleweb: sector.titleweb,
      backgroundImage: sector.backgroundImage,
    };

    return this.https.put<StoreSectores>(url, sectorToUpdate, { headers });

  }
  
  /* Modificación de los sectores asociados a una solución */
  updateSolucionSectores(idSolucion: number, solucionSector: SolucionSector): Observable<any> {
    const url = `${this.sectoresUrl}/modifySolucionSectores/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.log('⌛ Actualizando sector de la solución:', {
      url,
      idSolucion,
      solucionSector
    });
  
    return this.https.put<any>(url, solucionSector, { headers }).pipe(
      map(response => {
        console.log('✅ Sector actualizado correctamente:', response);
        return response;
      }),
      catchError(error => {
        if (error.status === 404) {
          console.error('❌ Ruta no encontrada:', url);
          console.error('Detalles del error:', error);
        } else {
          console.error('❌ Error al actualizar sector:', error);
        }
        return throwError(() => new Error(`Error al actualizar sector: ${error.message}`));
      })
    );
  }

  /* Elimina un sector específico */
  deleteSector(idSolucion: number,idSector: number): Observable<DeleteSectorResponse> {
    const url = `${this.sectoresUrl}/deleteSectores/${idSolucion}/${idSector}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSectorResponse>(url, { headers });
  }

  /* Modificación de un sector de una solución específica */
  modifySolucionSector(idSolucion: number, idSector: number, solucionSector: SolucionSector): Observable<SolucionSector> {
    const url = `${this.sectoresUrl}/modifySectores/${idSolucion}/${idSector}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const solucionSectorToUpdate: SolucionSector = {
      id_solucion: idSolucion,
      id_sector: idSector,
      descalternativa: solucionSector.descalternativa,
      textoalternativo: solucionSector.textoalternativo
    };
  
    return this.https.put<SolucionSector>(url, solucionSectorToUpdate, { headers }).pipe(
      map(response => {
        console.log('✅ Sector actualizado correctamente:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error al actualizar sector:', error);
        return throwError(() => new Error(`Error al actualizar sector: ${error.message}`));
      })
    );
  }

  /* Eliminación de la relación entre un sector y una solución */
  deleteSolucionSector(idSolucion: number, idSector: number): Observable<DeleteSolucionSectorResponse> {
    const url = `${this.sectoresUrl}/deleteSolucionSector/${idSolucion}/${idSector}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.log('Eliminando relación sector-solución:', url);
    
    return this.https.delete<DeleteSolucionSectorResponse>(url, { headers }).pipe(
      map(response => {
        console.log('Respuesta al eliminar relación:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error al eliminar la relación:', error);
        throw error;
      })
    );
  }

  /* SolucionSectorAmbito */

  /* Obtiene la tabla completa de storeSolucionesAmbitosSectores con los campos de la solución por ámbitos y sectores*/
  getStoreSolucionAmbitosSectores(): Observable<SolucionAmbitoSector[]> {
    const url = `${this.sectoresUrl}/listSectoresAmbitosSoluciones`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.info('ℹ️ Consultando tabla de storeSolucionesAmbitosSectores...');
    
    return this.https.get<SolucionAmbitoSector[]>(url, { headers }).pipe(
      map(response => {
        if (response && response.length > 0) {
          console.log('✅ Tabla de storeSolucionesAmbitosSectores recuperada correctamente');
        } else {
          console.info('ℹ️ No hay datos en la tabla de storeSolucionesAmbitosSectores');
        }
        return response || [];
      }),
      catchError(error => {
        if (error.status === 404) {
          console.info('ℹ️ Sin datos para mostrar en la tabla de storeSolucionesAmbitosSectores');
        } else {
          console.warn('⚠️ Error al consultar la tabla de storeSolucionesAmbitosSectores:', error);
        }
        return of([]);
      })
    );
  }

}



