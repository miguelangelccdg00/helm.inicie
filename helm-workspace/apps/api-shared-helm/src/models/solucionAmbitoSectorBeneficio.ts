export interface SolucionAmbitoSectorBeneficio
{
    id_solucion?: number;
    id_ambito?: number;
    id_sector?: number;
    id_beneficio?: number;
}

export interface SelectorSolucionAmbitoSectorBeneficioResponse {
    message: string;
    selectorBeneficio: any[];
}