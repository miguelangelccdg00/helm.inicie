import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

/* Interfaces */

/* StoreSoluciones */

export interface StoreSoluciones {
  id_solucion: number;
  description: string;
  title: string | null;
  subtitle: string | null;
  icon: string;
  slug: string;
  titleweb: string | null;
  multimediaUri: string | null;
  multimediaTypeId: number | null;
  problemaTitle: string | null;
  problemaPragma: string | null;
  solucionTitle: string | null;
  solucionPragma: string | null;
  caracteristicasTitle: string | null;
  caracteristicasPragma: string | null;
  casosdeusoTitle: string | null;
  casosdeusoPragma: string | null;
  firstCtaTitle: string | null;
  firstCtaPragma: string | null;
  secondCtaTitle: string | null;
  secondCtaPragma: string | null;
  titleBeneficio: string | null;
  beneficiosPragma: string | null;
  // Campos adicionales que podrían estar en la respuesta
  sector?: string;
  ambito?: string;
  id_ambito?: number;
  responseChat?: string;
  data?: string;
  deleted?: boolean;
  beneficios: StoreBeneficios[];
  problemas: StoreProblemas[];
  caracteristicas: StoreCaracteristicas[];
}

export interface UpdateStoreSolucionResponse {
  success: boolean;
  message?: string;
  updatedSolucion?: StoreSoluciones;
}

export interface DeleteSolucionResponse {
  message: string;
}

/* Beneficios */

export interface StoreBeneficios {
  id_beneficio?: number;
  titulo?: string;
  description: string;
}

export interface CreateBeneficioResponse {
  message: string;
  beneficio: StoreBeneficios;
}

export interface DeleteBeneficioResponse {
  message: string;
}

/* Problemas */

export interface StoreProblemas {
  id_problema?: number;
  titulo?: string;
  description: string;
}

export interface CreateProblemaResponse {
  message: string;
  problema: StoreProblemas;
}

export interface DeleteProblemaResponse {
  message: string;
}

/* Características */

export interface StoreCaracteristicas {
  id_caracteristica?: number;
  titulo?: string;
  description: string;
}

export interface CreateCaracteristicaResponse {
  message: string;
  caracteristica: StoreCaracteristicas;
}

export interface DeleteCaracteristicaResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})

export class StoreSolucionesService {

  private apiUrl = 'http://localhost:3009/storeSolucion/listStoreSoluciones';
  private beneficiosUrl = 'http://localhost:3009/storeBeneficios';
  private problemasUrl = 'http://localhost:3009/storeProblemas';
  private caracteristicasUrl = 'http://localhost:3009/storeCaracteristicas';

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

    // Creamos un objeto completo con todos los campos necesarios
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
      
      // Siempre incluimos estos campos para asegurar que se envíen correctamente
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
    const url = `http://localhost:3009/storeSolucion/deleteStoreSolucion/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSolucionResponse>(url, { headers });
  }

  /* Beneficios */

  getBeneficiosBySolucion(idSolucion: number): Observable<StoreBeneficios[]> {
    const url = `${this.beneficiosUrl}/listBeneficios/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreBeneficios[]>(url, { headers });
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
    return this.https.get<StoreProblemas[]>(url, { headers });
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

  createCaracteristica(idSolucion: number, caracteristica: StoreCaracteristicas): Observable<CreateCaracteristicaResponse> {
    const url = `${this.caracteristicasUrl}/createCaracteristicas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const caracteristicaToCreate = {
      titulo: caracteristica.titulo,
      description: caracteristica.description
    };

    // Guardamos los valores originales para asegurarnos de que no se pierdan
    const originalTitle = caracteristica.titulo;
    const originalDescription = caracteristica.description;

    console.log('Valores originales a guardar:', { title: originalTitle, description: originalDescription });

    // Primero creamos la característica
    return this.https.post<CreateCaracteristicaResponse>(url, caracteristicaToCreate, { headers }).pipe(
      switchMap(response => {
        // Después de crear la característica, actualizamos la solución con los valores originales
        return this.getStoreSolucionById(idSolucion).pipe(
          switchMap(solucion => {
            // Usamos los valores originales guardados, no los que podrían haber cambiado
            solucion.caracteristicasTitle = originalTitle || solucion.caracteristicasTitle;
            solucion.caracteristicasPragma = originalDescription;
            
            console.log('Actualizando solución después de crear característica:');
            console.log('caracteristicasTitle:', originalTitle);
            console.log('caracteristicasPragma:', originalDescription);
            
            return this.updateStoreSolucion(idSolucion, solucion).pipe(
              map(() => {
                // Devolvemos la respuesta original con los valores correctos
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
    return this.https.get<StoreCaracteristicas[]>(url, { headers });
  }

  getAllCaracteristicas(): Observable<StoreCaracteristicas[]> {
    const url = `${this.caracteristicasUrl}/listCompleteCaracteristicas`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreCaracteristicas[]>(url, { headers });
  }

  asociarCaracteristicaASolucion(idSolucion: number, idCaracteristica: number, titulo?: string): Observable<any> {
    const url = `${this.caracteristicasUrl}/asociarCaracteristica`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Solo enviamos la información mínima necesaria para la asociación
    const relacion = {
      id_solucion: idSolucion,
      id_caracteristica: idCaracteristica
    };

    // No incluimos el título ni actualizamos la solución
    return this.https.post<any>(url, relacion, { headers });
  }

  // También necesitamos añadir este método para obtener una característica por su ID
  getCaracteristicaById(idCaracteristica: number): Observable<StoreCaracteristicas> {
    const url = `${this.caracteristicasUrl}/getCaracteristica/${idCaracteristica}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreCaracteristicas>(url, { headers });
  }

  updateCaracteristicaAndAsociar(idSolucion: number, caracteristica: StoreCaracteristicas): Observable<any> {
    // Primero verificamos si necesitamos asociar una característica existente
    if (caracteristica.id_caracteristica) {
      // Si hay un ID de característica, primero hacemos la asociación
      return this.asociarCaracteristicaASolucion(idSolucion, caracteristica.id_caracteristica).pipe(
        switchMap(() => {
          // Después de asociar, actualizamos la solución con los datos de la característica
          return this.getStoreSolucionById(idSolucion).pipe(
            switchMap(solucion => {
              // Actualizamos los campos en la solución
              solucion.caracteristicasTitle = caracteristica.titulo || solucion.caracteristicasTitle;
              solucion.caracteristicasPragma = caracteristica.description;
              
              console.log('Actualizando caracteristicasTitle a:', caracteristica.titulo);
              console.log('Actualizando caracteristicasPragma a:', caracteristica.description);
              
              // Finalmente actualizamos la solución
              return this.updateStoreSolucion(idSolucion, solucion);
            })
          );
        })
      );
    } else {
      // Si no hay ID de característica, solo actualizamos la solución
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

}