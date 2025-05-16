import { StoreCaracteristicas, Asociacion } from './storeCaracteristicas';

export interface SolucionAmbitoCaracteristica
{
    id_solucion?: number;
    id_ambito?: number;
    id_caracteristica?: number;
}

export interface AsociarSolucionAmbitoCaracteristicaResponse {
    message: string;
    asociacion: Asociacion;
    caracteristica: StoreCaracteristicas;
}