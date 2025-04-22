export interface StoreProblemas {
    id_problema?: number;
    titulo?: string;
    description: string;
}

export interface CreateProblemaResponse {
    message: string;
    problema: StoreProblemas;
}

export interface DeleteProblemaResponse {
    message: string;
}