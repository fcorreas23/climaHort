export function getVentilationAdvice(percent: number, tieneLucarnas: boolean): string {
 

  if (tieneLucarnas) {
    if (percent < 35) return '⚠️ Baja ventilación. Se recomienda al menos 35% para ventilación lateral + techo.';
    if (percent <= 60) return '✅ Ventilación adecuada para diseño con lúcarnas.';
    return '🔍 Revisa si los datos de superficie están correctos (ventilación muy alta).';
  } else {
    if (percent < 15) return '⚠️ Baja ventilación. Mínimo 15% recomendado para ventilación lateral.';
    if (percent <= 25) return '✅ Ventilación adecuada para ventilación lateral.';
    return '🔍 Revisa si los datos de superficie están correctos (ventilación muy alta).';
  }
}