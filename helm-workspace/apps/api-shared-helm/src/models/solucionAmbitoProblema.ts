import { StoreProblemas, Asociacion } from './storeProblemas';

export interface SolucionAmbitoProblema
{
    id_solucion?: number;
    id_ambito?: number;
    id_problema?: number;
}

export interface AsociarSolucionAmbitoProblemaResponse {
    message: string;
    asociacion: Asociacion;
    problema: StoreProblemas;
}