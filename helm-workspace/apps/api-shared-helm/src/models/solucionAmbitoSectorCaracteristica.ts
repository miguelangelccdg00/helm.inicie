import { StoreCaracteristicas, Asociacion } from "./storeCaracteristicas";

export interface SolucionAmbitoSectorCaracteristica 
{
    id_solucion?: number;
    id_ambito?: number;
    id_sector?: number;
    id_caracteristica?: number;
}

export interface AsociarSolucionAmbitoSectorCaracteristicaResponse {
    message: string;
    asociacion: Asociacion;
    caracteristica: StoreCaracteristicas;
}