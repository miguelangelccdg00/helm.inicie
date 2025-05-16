import { StoreBeneficios, Asociacion } from './storeBeneficios';

export interface SolucionAmbitoBeneficio {
    id_solucion?: number;
    id_ambito?: number;
    id_beneficio?: number;
}

export interface AsociarSolucionAmbitoBeneficioResponse {
    message: string;
    asociacion: Asociacion;
    beneficio: StoreBeneficios;
}