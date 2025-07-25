export function getSoilMeasureStatus(soilType: string, sm: number): 'Estrés hídrico' | 'Óptima' | 'Saturación' | 'Desconocido' {
  const ranges: Record<string, {
    stress: [number, number];
    optimal: [number, number];
    saturation: [number, number];
  }> = {
    'Franco-arenoso': { stress: [7, 12], optimal: [10, 15], saturation: [20, 25] },
    'Franco-limoso': { stress: [12, 18], optimal: [18, 28], saturation: [35, 40] },
    'Franco-arcilloso': { stress: [15, 22], optimal: [22, 35], saturation: [40, 50] }
  };

  const r = ranges[soilType];
  if (!r || isNaN(sm)) return 'Desconocido';

  if (sm < r.stress[0]) return 'Estrés hídrico';
  if (sm >= r.stress[0] && sm < r.optimal[0]) return 'Estrés hídrico';
  if (sm >= r.optimal[0] && sm <= r.optimal[1]) return 'Óptima';
  if (sm > r.optimal[1] && sm <= r.saturation[1]) return 'Saturación';
  if (sm > r.saturation[1]) return 'Saturación';

  return 'Desconocido';
}