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