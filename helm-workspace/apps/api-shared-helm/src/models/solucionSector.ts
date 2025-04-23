export interface SolucionSector
{
    id?: number;
    id_solucion?: number;
    id_sector?: number;
    descalternativa: string;
    textoalternativo: string
}

export interface DeleteSolucionSectorResponse 
{
    message: string;
}