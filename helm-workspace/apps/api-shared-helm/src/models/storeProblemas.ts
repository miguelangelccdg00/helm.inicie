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

export interface Asociacion {
  idSolucion: number;
  idProblema: number;
  message: string;
  titulo?: string;
}

export interface AsociarProblemaResponse {
  message: string;
  asociacion: Asociacion;
}