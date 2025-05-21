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
    descalternativa?: string;
    textoalternativo?: string;

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

export interface Asociacion
{
    idSolucion: number;
    idSector: number;
}

export interface AsociarSectorResponse
{
    message: string;
    asociacion: Asociacion;
    sector: StoreSectores;
    sectoresActualizados: StoreSectores[];
}