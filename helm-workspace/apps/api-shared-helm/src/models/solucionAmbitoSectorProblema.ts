import { StoreProblemas, Asociacion } from './storeProblemas';


export interface SolucionAmbitoSectorProblema
{
    id_solucion?: number;
    id_ambito?: number;
    id_sector?: number;
    id_problema?: number;
}

export interface AsociarSolucionAmbitoSectorProblemaResponse {
    message: string;
    asociacion: Asociacion;
    problema: StoreProblemas;
}