import { StoreBeneficios } from './storeBeneficios';
import { StoreProblemas } from './storeProblemas';
import { StoreCaracteristicas } from './storeCaracteristicas';
import { StoreAmbitos } from './storeAmbitos';
import { SolucionAmbito } from './solucionAmbito';

export interface StoreSoluciones {
    id_solucion: number;
    description: string;
    title: string | null;
    subtitle: string | null;
    icon: string;
    slug: string;
    titleweb: string | null;
    multimediaUri: string | null;
    multimediaTypeId: number | null;
    problemaTitle: string | null;
    problemaPragma: string | null;
    solucionTitle: string | null;
    solucionPragma: string | null;
    caracteristicasTitle: string | null;
    caracteristicasPragma: string | null;
    casosdeusoTitle: string | null;
    casosdeusoPragma: string | null;
    firstCtaTitle: string | null;
    firstCtaPragma: string | null;
    secondCtaTitle: string | null;
    secondCtaPragma: string | null;
    titleBeneficio: string | null;
    beneficiosPragma: string | null;
    // Campos adicionales que podrían estar en la respuesta
    sector?: string;
    ambito?: string;
    id_ambito?: number;
    responseChat?: string;
    data?: string;
    deleted?: boolean;
    beneficios: StoreBeneficios[];
    problemas: StoreProblemas[];
    caracteristicas: StoreCaracteristicas[];
    ambitos: StoreAmbitos[];
    solucionAmbito: SolucionAmbito[];
}

export interface UpdateStoreSolucionResponse {
    success: boolean;
    message?: string;
    updatedSolucion?: StoreSoluciones;
}

export interface DeleteSolucionResponse {
    message: string;
}