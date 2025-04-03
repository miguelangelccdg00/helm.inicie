import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  problemas: StoreBeneficios[];
}

export interface StoreBeneficios {
  id_beneficio?: number;
  titulo?: string;
  description: string;
}

export interface UpdateStoreSolucionResponse {
  success: boolean;
  message?: string;
  updatedSolucion?: StoreSoluciones;
}

export interface DeleteSolucionResponse {
  message: string;
}

export interface CreateBeneficioResponse {
  message: string;
  beneficio: StoreBeneficios;
}

export interface DeleteBeneficioResponse {
  message: string;
}

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

@Injectable({
  providedIn: 'root'
})

export class StoreSolucionesService {

  private apiUrl = 'http://localhost:3009/storeSolucion/listStoreSoluciones';
  private beneficiosUrl = 'http://localhost:3009/storeBeneficios';
  private problemasUrl = 'http://localhost:3009/storeProblemas';

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

  updateStoreSolucion(id: number, solucion: StoreSoluciones): Observable<UpdateStoreSolucionResponse> {
    const url = `http://localhost:3009/storeSolucion/modifyStoreSoluciones/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const solucionToUpdate = {
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

    return this.https.put<UpdateStoreSolucionResponse>(url, solucionToUpdate, { headers });
  }

  deleteStoreSolucion(id: number): Observable<DeleteSolucionResponse> {
    const url = `http://localhost:3009/storeSolucion/deleteStoreSolucion/${id}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete<DeleteSolucionResponse>(url, { headers });
  }

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

  asociarProblemaASolucion(idSolucion: number, idProblema: number): Observable<any> {
    const url = `${this.problemasUrl}/asociarProblema`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    const relacion = {
      id_solucion: idSolucion,
      id_problema: idProblema
    };
    
    return this.https.post<any>(url, relacion, { headers });
  }

  createProblema(idSolucion: number, problema: StoreBeneficios): Observable<CreateProblemaResponse> {
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

  getProblemasBySolucion(idSolucion: number): Observable<StoreBeneficios[]> {
    const url = `${this.problemasUrl}/listProblemas/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreBeneficios[]>(url, { headers });
  }

  getAllProblemas(): Observable<StoreBeneficios[]> {
    const url = `${this.problemasUrl}/listCompleteProblemas`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreBeneficios[]>(url, { headers });
  }

}