import { vpdRanges } from "@/store/vpdRanges";

export function calculateVPD(temperature: number, humidity: number): number {
  const es = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  const ea = es * (humidity / 100);
  return parseFloat((es - ea).toFixed(2));
}

export function getVPDStatus(vpd: number, crop: string): string {
  const range = vpdRanges.find(c => c.crop.toLowerCase() === crop.toLowerCase());
  if (!range) return 'Cultivo no encontrado';

  const isOptimal = Array.isArray(range.optimal)
    ? vpd >= range.optimal[0] && vpd <= range.optimal[1]
    : vpd === range.optimal;

  const isStress =
    (range.stress.includes('lt') && vpd < range.stressLimits[range.stress.indexOf('lt')]) ||
    (range.stress.includes('gt') && vpd > range.stressLimits[range.stress.indexOf('gt')]);

  if (isStress) return '⚠️ Estrés – condiciones críticas';
  if (isOptimal) return '✅ Óptimo – condiciones ideales';
  if (vpd >= range.min) return '🟡 Aceptable – fuera del óptimo';
  return '🔵 Muy bajo – posible riesgo de enfermedades';
}