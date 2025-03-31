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

export interface StoreBeneficios {
  id_beneficio?: number;
  description?: string; // Campo real en la base de datos
  titulo?: string;      // Campo para la interfaz de usuario
  descripcion: string;  // Campo para la interfaz de usuario que se mapea a description
}

// Nueva interfaz para las peticiones
export interface Peticion {
  id_sector: number;
  sector: string;
  id_solucion: number;
  solucion: string;
  id_ambito: number;
  ambito: string;
  responsechat: string;
  data: string;
  deleted: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class StoreSolucionesService {

  private apiUrl = 'http://localhost:3009/storeSolucion/listStoreSoluciones';
  private peticionesUrl = 'http://localhost:3009/peticiones';
  private beneficiosUrl = 'http://localhost:3009/storeBeneficios';

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
    
    // Crear un objeto con solo los campos que existen en la base de datos
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
      beneficiosTitle: solucion.beneficiosTitle,
      beneficiosPragma: solucion.beneficiosPragma
    };
    
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

  /**
   * Obtiene todos los beneficios de una solución
   * @param idSolucion ID de la solución
   */
  getBeneficiosBySolucion(idSolucion: number): Observable<StoreBeneficios[]> {
    const url = `${this.beneficiosUrl}/listBeneficios/${idSolucion}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<StoreBeneficios[]>(url, { headers });
  }

    /**
   * Crea un nuevo beneficio para una solución
   * @param idSolucion ID de la solución
   * @param beneficio Datos del beneficio a crear
   */
    createBeneficio(idSolucion: number, beneficio: StoreBeneficios): Observable<any> {
      const url = `${this.beneficiosUrl}/createBeneficio/${idSolucion}`;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      
      // Solo incluir el campo description que existe en la tabla storeBeneficios
      const beneficioToCreate = {
        description: beneficio.descripcion
      };
      
      // El backend debe encargarse de crear la relación con id_solucion
      return this.https.post(url, beneficioToCreate, { headers });
    }

  /**
   * Elimina un beneficio por su ID
   * @param idBeneficio ID del beneficio a eliminar
   */
  deleteBeneficio(idBeneficio: number): Observable<any> {
    const url = `${this.beneficiosUrl}/deleteBeneficio/${idBeneficio}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete(url, { headers });
  }

  /**
   * Obtiene todas las peticiones
   */
  getPeticiones(): Observable<Peticion[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<Peticion[]>(`${this.peticionesUrl}/listPeticiones`, { headers });
  }

  /**
   * Obtiene una petición específica por su ID
   * @param id ID de la petición a obtener
   */
  getPeticionById(id: number): Observable<Peticion> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.get<Peticion>(`${this.peticionesUrl}/listIdPeticion/${id}`, { headers });
  }

  /**
   * Crea una nueva petición
   * @param peticion Datos de la petición a crear
   */
  createPeticion(peticion: Peticion): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.post(`${this.peticionesUrl}/createPeticion`, peticion, { headers });
  }

  /**
   * Actualiza una petición existente
   * @param id ID de la petición a actualizar
   * @param peticion Datos de la petición a actualizar
   */
  updatePeticion(id: number, peticion: Peticion): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.put(`${this.peticionesUrl}/modifyPeticion/${id}`, peticion, { headers });
  }

  /**
   * Elimina una petición por su ID
   * @param id ID de la petición a eliminar
   */
  deletePeticion(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.https.delete(`${this.peticionesUrl}/deletePeticion/${id}`, { headers });
  }
}