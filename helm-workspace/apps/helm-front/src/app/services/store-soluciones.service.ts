import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { StoreSoluciones, UpdateStoreSolucionResponse, DeleteSolucionResponse } from '@modelos-shared/storeSoluciones'
import { StoreBeneficios, CreateBeneficioResponse, DeleteBeneficioResponse } from '@modelos-shared/storeBeneficios';
import { StoreProblemas, CreateProblemaResponse, DeleteProblemaResponse } from '@modelos-shared/storeProblemas';
import { StoreCaracteristicas, CreateCaracteristicaResponse, DeleteCaracteristicaResponse } from '@modelos-shared/storeCaracteristicas';
import { StoreAmbitos, CreateAmbitoResponse, DeleteAmbitoResponse } from '@modelos-shared/storeAmbitos';
import { SolucionAmbito, DeleteSolucionAmbitoResponse } from '@modelos-shared/solucionAmbito';
import { StoreSectores, CreateSectorResponse } from '@modelos-shared/storeSectores';

@Injectable({
  providedIn: 'root'
})

export class StoreSolucionesService {

  private apiUrl = 'http://localhost:3009/storeSolucion/listStoreSoluciones';
  private beneficiosUrl = 'http://localhost:3009/storeBeneficios';
  private problemasUrl = 'http://localhost:3009/storeProblemas';
  private caracteristicasUrl = 'http://localhost:3009/storeCaracteristicas';
  private ambitosUrl = 'http://localhost:3009/storeAmbitos';
  private sectoresUrl = 'http://localhost:3009/storeSectores';

  constructor(private https: HttpClient) { }

  /* StoreSoluciones */

  getStoreSoluciones(): Observable<StoreSoluciones[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones[]>(this.apiUrl, { headers });
  }

  getStoreSolucionById(id: number): Observable<StoreSoluciones> {
    const url = `http://localhost:3009/storeSolucion/listIdStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones>(url, { headers });
  }

  updateStoreSolucion(id: number, solucion: StoreSoluciones): Observable<UpdateStoreSolucionResponse> {
    const url = `http://localhost:3009/storeSolucion/modifyStoreSoluciones/${id}`;
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

  deleteStoreSolucion(id: number): Observable<DeleteSolucionResponse> {
    const url = `http://localhost:3009/storeSolucion/deleteSolucion/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSolucionResponse>(url, { headers });
  }

  /* Beneficios */

  modifyBeneficio(idBeneficio: number, beneficio: StoreBeneficios): Observable<StoreBeneficios> {
    const url = `${this.beneficiosUrl}/modifyStoreBeneficio/${idBeneficio}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const beneficioToUpdate = {
      description: beneficio.description
    };

    return this.https.put<StoreBeneficios>(url, beneficioToUpdate, { headers });
  }

  getBeneficiosBySolucion(idSolucion: number): Observable<StoreBeneficios[]> {
    const url = `${this.beneficiosUrl}/listBeneficios/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreBeneficios[]>(url, { headers }).pipe(
      map(beneficios => {
        console.log('Beneficios recuperados:', beneficios);
        return Array.isArray(beneficios) ? beneficios : [];
      }),
      catchError(error => {
        console.error(`Error al obtener beneficios para la solución ${idSolucion}:`, error);
        // Verificar específicamente si es un error 404 (Not Found)
        if (error.status === 404) {
          console.log(`No se encontraron beneficios para la solución ${idSolucion}, devolviendo array vacío`);
        }
        // Siempre devolver un array vacío en caso de error
        return of([]);
      })
    );
  }

  getAllBeneficios(): Observable<StoreBeneficios[]> {
    const url = `${this.beneficiosUrl}/listCompleteBeneficios`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreBeneficios[]>(url, { headers });
  }

  createBeneficio(idSolucion: number, beneficio: StoreBeneficios): Observable<CreateBeneficioResponse> {
    const url = `${this.beneficiosUrl}/createBeneficio/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const beneficioToCreate = {
      titulo: beneficio.titulo,
      description: beneficio.description
    };

    return this.https.post<CreateBeneficioResponse>(url, beneficioToCreate, { headers });
  }

  deleteBeneficio(idBeneficio: number): Observable<DeleteBeneficioResponse> {
    const url = `${this.beneficiosUrl}/deleteBeneficio/${idBeneficio}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteBeneficioResponse>(url, { headers });
  }

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

  modifyProblema(idProblema: number, problema: StoreProblemas): Observable<StoreProblemas> {
    const url = `${this.problemasUrl}/modifyStoreProblema/${idProblema}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    const problemaToUpdate = {
      description: problema.description
    };
  
    return this.https.put<StoreProblemas>(url, problemaToUpdate, { headers });
  }

  asociarProblemaASolucion(idSolucion: number, idProblema: number): Observable<any> {
    const url = `${this.problemasUrl}/asociarProblema`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_problema: idProblema
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  createProblema(idSolucion: number, problema: StoreProblemas): Observable<CreateProblemaResponse> {
    const url = `${this.problemasUrl}/createProblema/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const problemaToCreate = {
      titulo: problema.titulo,
      description: problema.description
    };

    return this.https.post<CreateProblemaResponse>(url, problemaToCreate, { headers });
  }

  deleteProblema(idProblema: number): Observable<DeleteProblemaResponse> {
    const url = `${this.problemasUrl}/deleteProblema/${idProblema}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteProblemaResponse>(url, { headers });
  }

  getProblemasBySolucion(idSolucion: number): Observable<StoreProblemas[]> {
    const url = `${this.problemasUrl}/listProblemas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreProblemas[]>(url, { headers }).pipe(
      map(problemas => {
        console.log('Problemas recuperados:', problemas);
        return Array.isArray(problemas) ? problemas : [];
      }),
      catchError(error => {
        console.error(`Error al obtener problemas para la solución ${idSolucion}:`, error);
        // Verificar específicamente si es un error 404 (Not Found)
        if (error.status === 404) {
          console.log(`No se encontraron problemas para la solución ${idSolucion}, devolviendo array vacío`);
        }
        // Siempre devolver un array vacío en caso de error
        return of([]);
      })
    );
  }

  getAllProblemas(): Observable<StoreProblemas[]> {
    const url = `${this.problemasUrl}/listCompleteProblemas`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreProblemas[]>(url, { headers });
  }

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

  modifyCaracteristica(idCaracteristica: number, caracteristica: StoreCaracteristicas): Observable<StoreCaracteristicas> {
    const url = `${this.caracteristicasUrl}/modifyStoreCaracteristica/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const caracteristicaToUpdate = {
      description: caracteristica.description
    };

    return this.https.put<StoreCaracteristicas>(url, caracteristicaToUpdate, { headers });
  }

  createCaracteristica(idSolucion: number, caracteristica: StoreCaracteristicas): Observable<CreateCaracteristicaResponse> {
    const url = `${this.caracteristicasUrl}/createCaracteristicas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const caracteristicaToCreate = {
      titulo: caracteristica.titulo,
      description: caracteristica.description
    };

    const originalTitle = caracteristica.titulo;
    const originalDescription = caracteristica.description;

    console.log('Valores originales a guardar:', { title: originalTitle, description: originalDescription });

    return this.https.post<CreateCaracteristicaResponse>(url, caracteristicaToCreate, { headers }).pipe(
      switchMap(response => {
        return this.getStoreSolucionById(idSolucion).pipe(
          switchMap(solucion => {
            solucion.caracteristicasTitle = originalTitle || solucion.caracteristicasTitle;
            solucion.caracteristicasPragma = originalDescription;
            
            console.log('Actualizando solución después de crear característica:');
            console.log('caracteristicasTitle:', originalTitle);
            console.log('caracteristicasPragma:', originalDescription);
            
            return this.updateStoreSolucion(idSolucion, solucion).pipe(
              map(() => {
                return {
                  ...response,
                  caracteristica: {
                    ...response.caracteristica,
                    titulo: originalTitle,
                    description: originalDescription
                  }
                };
              })
            );
          })
        );
      })
    );
  }

  deleteCaracteristica(idCaracteristica: number): Observable<DeleteCaracteristicaResponse> {
    const url = `${this.caracteristicasUrl}/deleteCaracteristicas/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteCaracteristicaResponse>(url, { headers });
  }

  getCaracteristicasBySolucion(idSolucion: number): Observable<StoreCaracteristicas[]> {
    const url = `${this.caracteristicasUrl}/listCaracteristicas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreCaracteristicas[]>(url, { headers }).pipe(
      map(caracteristicas => {
        console.log('Características recuperadas:', caracteristicas);
        return Array.isArray(caracteristicas) ? caracteristicas : [];
      }),
      catchError(error => {
        console.error(`Error al obtener características para la solución ${idSolucion}:`, error);
        // Verificar específicamente si es un error 404 (Not Found)
        if (error.status === 404) {
          console.log(`No se encontraron características para la solución ${idSolucion}, devolviendo array vacío`);
        }
        // Siempre devolver un array vacío en caso de error
        return of([]);
      })
    );
  }

  getAllCaracteristicas(): Observable<StoreCaracteristicas[]> {
    const url = `${this.caracteristicasUrl}/listCompleteCaracteristicas`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreCaracteristicas[]>(url, { headers });
  }

  asociarCaracteristicaASolucion(idSolucion: number, idCaracteristica: number, titulo?: string): Observable<any> {
    const url = `${this.caracteristicasUrl}/asociarCaracteristica`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_caracteristica: idCaracteristica
    };

    return this.https.post<any>(url, relacion, { headers });
  }

  getCaracteristicaById(idCaracteristica: number): Observable<StoreCaracteristicas> {
    const url = `${this.caracteristicasUrl}/getCaracteristica/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreCaracteristicas>(url, { headers });
  }

  updateCaracteristicaAndAsociar(idSolucion: number, caracteristica: StoreCaracteristicas): Observable<any> {
    if (caracteristica.id_caracteristica) {
      return this.asociarCaracteristicaASolucion(idSolucion, caracteristica.id_caracteristica).pipe(
        switchMap(() => {
          return this.getStoreSolucionById(idSolucion).pipe(
            switchMap(solucion => {
              solucion.caracteristicasTitle = caracteristica.titulo || solucion.caracteristicasTitle;
              solucion.caracteristicasPragma = caracteristica.description;
              
              console.log('Actualizando caracteristicasTitle a:', caracteristica.titulo);
              console.log('Actualizando caracteristicasPragma a:', caracteristica.description);
              
              return this.updateStoreSolucion(idSolucion, solucion);
            })
          );
        })
      );
    } else {
      return this.getStoreSolucionById(idSolucion).pipe(
        switchMap(solucion => {
          solucion.caracteristicasTitle = caracteristica.titulo || solucion.caracteristicasTitle;
          solucion.caracteristicasPragma = caracteristica.description;
          
          console.log('Actualizando caracteristicasTitle a:', caracteristica.titulo);
          console.log('Actualizando caracteristicasPragma a:', caracteristica.description);
          
          return this.updateStoreSolucion(idSolucion, solucion).pipe(
            map(response => {
              return { 
                message: 'Característica actualizada sin asociación',
                caracteristicasTitle: caracteristica.titulo,
                caracteristicasPragma: caracteristica.description
              };
            })
          );
        })
      );
    }
  }

  /* Ámbitos */

  getAmbitosBySolucion(idSolucion: number): Observable<StoreAmbitos[]> {
    const url = `${this.ambitosUrl}/listAmbitosSolucion/${idSolucion}?_=${Date.now()}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreAmbitos[]>(url, { headers }).pipe(
      map(ambitos => {
        console.log('Ámbitos recuperados:', ambitos);
        if (!Array.isArray(ambitos)) {
          console.warn('La respuesta de ámbitos no es un array, convirtiendo:', ambitos);
          return ambitos ? [ambitos] : [];
        }
        return ambitos;
      }),
      catchError(error => {
        console.error(`Error al obtener ámbitos para la solución ${idSolucion}:`, error);
        if (error.status === 404) {
          console.log(`No se encontraron ámbitos para la solución ${idSolucion}, devolviendo array vacío`);
        }
        return of([]);
      })
    );
  }

  getAllAmbitos(): Observable<StoreAmbitos[]> {
    const url = `${this.ambitosUrl}/listCompleteAmbitos`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreAmbitos[]>(url, { headers });
  }

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

  asociarAmbitoASolucion(idSolucion: number, idAmbito: number): Observable<any> {
    const url = `${this.ambitosUrl}/asociarAmbito`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_ambito: idAmbito
    };

    return this.https.post<any>(url, relacion, { headers });
  }

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

  deleteAmbito(idAmbito: number): Observable<DeleteAmbitoResponse> {
    const url = `${this.ambitosUrl}/deleteAmbito/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteAmbitoResponse>(url, { headers });
  }

  listAmbitos(idSolucion: number): Observable<any> {
    const url = `${this.ambitosUrl}/listAmbitosSolucion/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<any>(url, { headers }).pipe(
      map(response => {
        console.log('Response from listAmbitos:', response);
        return response;
      })
    );
  }

  /* SolucionAmbito */

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

  deleteSolucionAmbito(idSolucion: number, idAmbito: number): Observable<DeleteSolucionAmbitoResponse> {
    const url = `http://localhost:3009/storeSolucion/removeAmbitoFromSolucion/${idSolucion}/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSolucionAmbitoResponse>(url, { headers });
  }

  updateSolucionAmbitos(idSolucion: number, solucionAmbitos: SolucionAmbito[]): Observable<any> {
    const url = `${this.ambitosUrl}/modifyAmbitos/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.put<any>(url, solucionAmbitos, { headers });
  }

  /* Sectores */

  createSector(idSolucion: number, sector: StoreSectores): Observable<CreateSectorResponse> {
    const url = `${this.sectoresUrl}/createSector/${idSolucion}`;
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
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSectores[]>(url, { headers });
  }

  getSectoresBySolucion(idSolucion: number): Observable<StoreSectores[]> {
    const url = `${this.ambitosUrl}/listSectoresSolucion/${idSolucion}?_=${Date.now()}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSectores[]>(url, { headers }).pipe(
      map(sectores => {
        console.log('Sectores recuperados:', sectores);
        if (!Array.isArray(sectores)) {
          console.warn('La respuesta de sectores no es un array, convirtiendo:', sectores);
          return sectores ? [sectores] : [];
        }
        return sectores;
      }),
      catchError(error => {
        console.error(`Error al obtener sectores para la solución ${idSolucion}:`, error);
        if (error.status === 404) {
          console.log(`No se encontraron sectores para la solución ${idSolucion}, devolviendo array vacío`);
        }
        return of([]);
      })
    );
  }

  listSectores(idSolucion: number): Observable<any> {
    const url = `${this.sectoresUrl}/listSectoresSolucion/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<any>(url, { headers }).pipe(
      map(response => {
        console.log('Response from listSectores:', response);
        return response;
      })
    );
  }

  asociarSectorASolucion(idSolucion: number, idSector: number): Observable<any> {
    const url = `${this.sectoresUrl}/asociarSectores`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const relacion = {
      id_solucion: idSolucion,
      id_sector: idSector
    };

    return this.https.post<any>(url, relacion, { headers });
  }

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

}
