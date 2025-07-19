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
  const status = getVPDStatus(v, crop);

  if (status === 'low') {
    if (sm > 70) {
      return { vpd: v, status, message: "🟡 VPD bajo y suelo muy húmedo. Revisa drenaje y ajusta riego." };
    } else if (sm < 30) {
      return { vpd: v, status, message: "🔴 VPD muy bajo y suelo seco: riesgo de estrés hídrico. Riega urgentemente." };
    } else {
      return { vpd: v, status, message: "ℹ️ VPD bajo. No hay riesgo inmediato, pero controla ventilación y humedad ambiental." };
    }
  }

  if (status === 'optimal') {
    if (sm > 70) {
      return { vpd: v, status, message: "🟢 VPD óptimo y suelo muy húmedo. Revisa drenaje y ajusta riego." };
    } else if (sm >= 40 && sm <= 70) {
      return { vpd: v, status, message: "✅ VPD y humedad del suelo en rangos óptimos. Condiciones ideales para el cultivo." };
    } else if (sm < 30) {
      return { vpd: v, status, message: "🟠 VPD óptimo pero suelo seco. Riega pronto para evitar estrés hídrico." };
    }
  }

  if (status === 'high') {
    if (sm > 70) {
      return { vpd: v, status, message: "🟡 VPD alto y suelo muy húmedo. Planta puede reponer el agua, pero monitorea evaporación y sombreado." };
    } else if (sm >= 40 && sm <= 70) {
      return { vpd: v, status, message: "🟠 VPD alto con humedad moderada. Aumenta frecuencia de riego o controla la transpiración." };
    } else if (sm < 30) {
      return { vpd: v, status, message: "🔴 VPD alto y suelo seco: riesgo severo de estrés hídrico. Riega urgentemente." };
    }
  }

  if (status === 'acceptable') {
    if (sm > 70) {
      return { vpd: v, status, message: "🟡 VPD aceptable pero suelo muy húmedo. Vigila evaporación excesiva o condensación." };
    } else if (sm >= 40 && sm <= 70) {
      return { vpd: v, status, message: "🟢 VPD aceptable y suelo en rango óptimo. Condiciones funcionales, pero no ideales." };
    } else if (sm < 30) {
      return { vpd: v, status, message: "🟠 VPD aceptable pero suelo seco. Posible estrés si continúa la pérdida de agua." };
    }
  }

  // Fallback
  return {
    vpd: v,
    status,
    message: "ℹ️ Diagnóstico no disponible para esta combinación. Verifica los datos ingresados."
  };
}
