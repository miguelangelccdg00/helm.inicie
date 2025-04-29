export interface StoreSectores
{
    id_sector?: number;
    description: string;
    textoweb: string;
    prefijo: string;
    slug: string;
    descriptionweb: string;
    titleweb: string;
    backgroundImage: string;
}

export interface SolucionSector {
    id_solucion: number;
    id_sector: number;
    descalternativa: string;
    textoalternativo: string;
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