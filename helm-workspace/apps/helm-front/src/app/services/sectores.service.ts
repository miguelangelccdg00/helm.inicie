import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreSectores, DeleteSectorResponse } from '@modelos-shared/storeSectores';

@Injectable({
  providedIn: 'root'
})
export class SectoresService {

  private sectoresUrl = 'http://localhost:3009/storeSectores';

  constructor(private https: HttpClient) { }
  
    getStoreSectores(): Observable<StoreSectores[]> {
      const url = `${this.sectoresUrl}/listCompleteSectores`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.https.get<StoreSectores[]>(url, { headers });
    }
  
    deleteStoreSector(idSector: number): Observable<DeleteSectorResponse> {
      const url = `${this.sectoresUrl}/deleteSectorById/${idSector}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.https.delete<DeleteSectorResponse>(url, { headers });
    }
  
    createStoreSector(sector: StoreSectores): Observable<StoreSectores> {
      const url = `${this.sectoresUrl}/createStoreSectores`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.https.post<StoreSectores>(url, sector, { headers });
    }
}
