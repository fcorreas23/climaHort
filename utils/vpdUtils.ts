export function calculateVPD(temperature: number, humidity: number): number {
  const es = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
  const ea = es * (humidity / 100);
  return parseFloat((es - ea).toFixed(2));
}

export function getVPDStatus(vpd: number, crop: string): string {
  type VPDRange = {
    optimalMin: number;
    optimalMax: number;
    acceptableMin: number;
    acceptableMax: number;
  };

  const vpdReference: Record<string, VPDRange> = {
    Acelga:     { optimalMin: 0.8, optimalMax: 0.8, acceptableMin: 0.4, acceptableMax: 1.5 },
    Ajo:        { optimalMin: 0.8, optimalMax: 0.8, acceptableMin: 0.4, acceptableMax: 1.5 },
    Betarraga:  { optimalMin: 0.9, optimalMax: 0.9, acceptableMin: 0.4, acceptableMax: 1.5 },
    Cilantro:   { optimalMin: 0.7, optimalMax: 0.7, acceptableMin: 0.3, acceptableMax: 1.5 },
    Espinaca:   { optimalMin: 0.7, optimalMax: 0.7, acceptableMin: 0.3, acceptableMax: 1.2 },
    Lechuga:    { optimalMin: 0.8, optimalMax: 1.2, acceptableMin: 0.4, acceptableMax: 1.5 },
    Pepino:     { optimalMin: 1.3, optimalMax: 1.3, acceptableMin: 0.4, acceptableMax: 2.8 },
    Pimentón:   { optimalMin: 0.9, optimalMax: 0.9, acceptableMin: 0.4, acceptableMax: 1.5 },
    Rábano:     { optimalMin: 0.9, optimalMax: 0.9, acceptableMin: 0.4, acceptableMax: 1.5 },
    Tomate:     { optimalMin: 0.8, optimalMax: 1.0, acceptableMin: 0.2, acceptableMax: 2.0 },
  };

  const range = vpdReference[crop];
  if (!range) return "Cultivo no reconocido";

  if (vpd >= range.optimalMin && vpd <= range.optimalMax) return "Óptimo";
  if (vpd >= range.acceptableMin && vpd <= range.acceptableMax) return "Aceptable";
  if (vpd < range.acceptableMin) return "Bajo";
  if (vpd > range.acceptableMax) return "Alto";

  return "Fuera de rango";
}
