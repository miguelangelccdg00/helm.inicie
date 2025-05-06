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
  
    /* Obtiene todos los sectores */
    getStoreSectores(): Observable<StoreSectores[]> {
      const url = `${this.sectoresUrl}/listCompleteSectores`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.https.get<StoreSectores[]>(url, { headers });
    }
  
    /* Elimina un sector específico por su id */
    deleteStoreSector(idSector: number): Observable<DeleteSectorResponse> {
      const url = `${this.sectoresUrl}/deleteSectorById/${idSector}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.https.delete<DeleteSectorResponse>(url, { headers });
    }
  
    /* Crea un sector */
    createStoreSector(sector: StoreSectores): Observable<StoreSectores> {
      const url = `${this.sectoresUrl}/createSectores`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return this.https.post<StoreSectores>(url, sector, { headers });
    }

    /* Modifica un sector por su id */
    modifySector(idSector: number, sector: StoreSectores): Observable<StoreSectores> {
      const url = `${this.sectoresUrl}/modifySectores/${idSector}`;
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
