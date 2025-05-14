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

export interface Asociacion {
  idSolucion: number;
  idCaracteristica: number;
  message: string;
  titulo?: string;
}

export interface AsociarCaracteristicaResponse {
  message: string;
  asociacion: Asociacion;
}