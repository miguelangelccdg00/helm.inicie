export interface StoreAmbitos {
    id_ambito?: number;
    description: string;
    textoweb: string;
    prefijo: string;
    slug: string;
}

export interface CreateAmbitoResponse {
    message: string;
    ambito: StoreAmbitos;
}

export interface DeleteAmbitoResponse {
    message: string;
}

export interface Asociacion {
    idSolucion: number;
    idAmbito: number;
}

export interface AsociarAmbitoResponse {
    message: string;
    asociacion: Asociacion;
    ambito: StoreAmbitos;
    ambitosActualizados: StoreAmbitos[];
}