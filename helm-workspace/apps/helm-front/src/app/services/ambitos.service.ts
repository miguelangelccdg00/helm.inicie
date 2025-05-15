import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreAmbitos, DeleteAmbitoResponse } from '@modelos-shared/storeAmbitos';

@Injectable({
  providedIn: 'root'
})
export class AmbitosService {

  private ambitosUrl = 'http://localhost:3009/storeAmbitos';

  constructor(private https: HttpClient) { }

  /* Obtiene todos los ámbitos */
  getStoreAmbitos(): Observable<StoreAmbitos[]> {
    const url = `${this.ambitosUrl}/listCompleteAmbitos`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreAmbitos[]>(url, { headers });
  }

  /* Elimina un ámbito específico por su id */
  deleteStoreAmbito(idAmbito: number): Observable<DeleteAmbitoResponse> {
    const url = `${this.ambitosUrl}/deleteAmbito/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteAmbitoResponse>(url, { headers });
  }

  /* Crea un ámbito */
  createStoreAmbito(ambito: StoreAmbitos): Observable<StoreAmbitos> {
    const url = `${this.ambitosUrl}/createAmbitoSolucion`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.post<StoreAmbitos>(url, ambito, { headers });
  }

  /* Modifica un ámbito por su id */
  modifyAmbito(idAmbito: number, ambito: StoreAmbitos): Observable<StoreAmbitos> {
    const url = `${this.ambitosUrl}/modifyAmbitos/${idAmbito}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const ambitoToUpdate = {
      description: ambito.description,
      textoweb: ambito.textoweb,
      prefijo: ambito.prefijo,
      slug: ambito.slug,
    };

    return this.https.put<StoreAmbitos>(url, ambitoToUpdate, { headers });

  }

}
