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

  getStoreSoluciones(): Observable<StoreSoluciones[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones[]>(this.apiUrl, { headers });
  }

  getStoreSolucionById(id: number): Observable<StoreSoluciones> {
    const url = `http://localhost:3009/storeSolucion/listIdStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreSoluciones>(url, { headers });
  }

  updateStoreSolucion(id: number, solucion: StoreSoluciones): Observable<any> {
    const url = `http://localhost:3009/storeSolucion/modifyStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.put(url, solucion, { headers });
  }

}