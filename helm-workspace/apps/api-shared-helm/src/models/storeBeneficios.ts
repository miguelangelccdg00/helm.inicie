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