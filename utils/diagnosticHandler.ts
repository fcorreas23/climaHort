import { calculateVPD, getVPDStatus } from './vpdUtils';

export function runFullDiagnosis(
  temp: string,
  humidity: string,
  soilMoisture: string,
  crop: string,
  greenhouse: any,
  soilType: string
) {
  const t = parseFloat(temp);
  const h = parseFloat(humidity);
  const sm = parseFloat(soilMoisture);

  if (isNaN(t) || isNaN(h) || isNaN(sm) || !crop || !greenhouse || !soilType) {
    return { error: 'Completa todos los campos correctamente' };
  }

  const v = calculateVPD(t, h);
  const status = getVPDStatus(v, crop);

  const soilRanges: Record<string, {
    optimal: [number, number],
    stress: [number, number],
    saturation: [number, number]
  }> = {
    'Franco-arenoso': {
      optimal: [10, 15],
      stress: [7, 12],
      saturation: [20, 25],
    },
    'Franco-limoso': {
      optimal: [18, 28],
      stress: [12, 18],
      saturation: [35, 40],
    },
    'Franco-arcilloso': {
      optimal: [22, 35],
      stress: [15, 22],
      saturation: [40, 50],
    }
  };

  const soilRange = soilRanges[soilType];

  let soilLevel: 'stress' | 'optimal' | 'saturation' = 'optimal';

  if (sm < soilRange.stress[0]) {
    soilLevel = 'stress';
  } else if (sm >= soilRange.stress[0] && sm < soilRange.optimal[0]) {
    soilLevel = 'stress';
  } else if (sm > soilRange.optimal[1] && sm <= soilRange.saturation[1]) {
    soilLevel = 'saturation';
  } else if (sm > soilRange.saturation[1]) {
    soilLevel = 'saturation';
  } else {
    soilLevel = 'optimal';
  }

   // Mensaje contextual según combinación VPD + suelo
  let message = '';
  if (status === 'low') {
    if (soilLevel === 'saturation') {
      message = '⚠️ VPD bajo y suelo húmedo: riesgo de exceso de agua. Revisa drenaje y ajusta riego.';
    } else if (soilLevel === 'stress') {
      message = '🟠 VPD bajo pero humedad escasa: riesgo leve de estrés hídrico';
    } else {
      message = '✅ VPD bajo y suelo saturado: condición aceptable en baja demanda. No hay riesgo inmediato, pero controla ventilación y humedad ambiental.';
    }
  } else if (status === 'optimal') {
    if (soilLevel === 'optimal') {
      message = ' ✅ VPD y humedad del suelo en rangos óptimos. Condiciones ideales para el cultivo.';
    } else if (soilLevel === 'stress') {
      message = '🟠 VPD óptimo pero humedad baja: considera un riego ligero para evitar estrés hídrico.';
    } else {
      message = '⚠️ VPD óptimo pero exceso de agua en el suelo: monitorea drenaje';
    }
  } else if (status === 'acceptable '){ 
    if (soilLevel === 'optimal') {
      message = '🟢 VPD aceptable y suelo en rango óptimo. Condiciones funcionales, pero no ideales.';
    } else if (soilLevel === 'stress') {
      message = '🟠 VPD aceptable pero suelo seco. Posible estrés si continúa la pérdida de agua.';
    } else {
      message = '🟡 VPD aceptable pero suelo muy húmedo. Vigila evaporación excesiva o condensación.';
    }
  }else { // status === 'alto'
    if (soilLevel === 'optimal') {
      message = '🟡 VPD alto y humedad buena: monitorea con frecuencia';
    } else if (soilLevel === 'stress') {
      message = '🚨 VPD alto y suelo seco: riesgo severo de estrés hídrico. Riega urgentemente.';
    } else {
      message = '🟠 VPD alto con exceso de agua: posible riesgo fisiológico. Monitorea evaporación y sombreado';
    }
  }

  return { vpd: v, status, message };
}
