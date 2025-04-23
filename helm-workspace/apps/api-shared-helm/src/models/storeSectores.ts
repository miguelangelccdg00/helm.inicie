export interface StoreSectores
{
    id_sector?: number;
    description: string;
    textoWeb: string;
    prefijo: string;
    slug: string;
    descriptionweb: string;
    titleweb: string;
    backgroundImage: string;
}

export interface CreateSectorResponse
{
    message: string;
    sector: StoreSectores;
}

export interface DeleteSectorResponse
{
    message: string;
}