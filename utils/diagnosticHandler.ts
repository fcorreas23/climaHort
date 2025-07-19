import { calculateVPD, getVPDStatus } from './vpdUtils';

export function runFullDiagnosis(
    temp: string, 
    humidity: string, 
    soilMoisture: string, 
    crop: string, 
    greenhouse: any
) {
    const t = parseFloat(temp);
    const h = parseFloat(humidity);
    const sm = parseFloat(soilMoisture);

    if (isNaN(t) || isNaN(h) || !crop || !greenhouse || isNaN(sm)) {
        return { error: 'Completa todos los campos correctamente' };
    }

    const v = calculateVPD(t, h);
    const status = getVPDStatus(v ,crop);

    return { vpd: v, status};

}