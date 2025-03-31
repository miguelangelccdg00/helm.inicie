import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StoreSoluciones 
{
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
    beneficiosTitle: string | null;
    beneficiosPragma: string | null;
    // Campos adicionales que podrían estar en la respuesta
    sector?: string;
    ambito?: string;
    id_ambito?: number;
    responseChat?: string;
    data?: string;
    deleted?: boolean;
    beneficios: StoreBeneficios[];
}

export interface StoreBeneficios{
  titulo: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})

export class StoreSolucionesService {

  private apiUrl = 'http://localhost:3009/storeSolucion/listStoreSoluciones';

  constructor(private https: HttpClient) { }

  /**
   * Obtiene todas las soluciones almacenadas
   */
  getStoreSoluciones(): Observable<StoreSoluciones[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones[]>(this.apiUrl, { headers });
  }

  /**
   * Obtiene una solución específica por su ID
   * @param id ID de la solución a obtener
   */
  getStoreSolucionById(id: number): Observable<StoreSoluciones> {
    const url = `http://localhost:3009/storeSolucion/listIdStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones>(url, { headers });
  }

  /**
   * Actualiza una solución existente
   * @param id ID de la solución a actualizar
   * @param solucion Datos de la solución a actualizar
   */
  updateStoreSolucion(id: number, solucion: StoreSoluciones): Observable<any> {
    const url = `http://localhost:3009/storeSolucion/modifyStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    // Crear una copia de la solución sin el array de beneficios
    const solucionToUpdate = { ...solucion } as Partial<StoreSoluciones>;
    delete solucionToUpdate.beneficios;
    
    return this.https.put(url, solucionToUpdate, { headers });
  }

  /**
   * Elimina una solución por su ID
   * @param id ID de la solución a eliminar
   */
  deleteStoreSolucion(id: number): Observable<any> {
    const url = `http://localhost:3009/storeSolucion/deleteStoreSolucion/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete(url, { headers });
  }
}