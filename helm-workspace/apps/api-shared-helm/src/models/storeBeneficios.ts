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

export interface Asociacion {
  idSolucion: number;
  idBeneficio: number;
  message: string;
  titulo?: string;
}

export interface AsociarBeneficioResponse {
  message: string;
  asociacion: Asociacion;
}