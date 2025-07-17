export type VPDRange = {
  crop: string;
  min: number;
  optimal: [number, number] | number;  // rango o valor único
  stress: Array<'lt' | 'gt'>;
  stressLimits: number[];
};

export const vpdRanges: VPDRange[] = [
  { crop: 'Acelga',     min: 0.4,  optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.4, 1.5] },
  { crop: 'Ajo',        min: 0.4,  optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.4, 1.5] },
  { crop: 'Betarraga',  min: 0.4,  optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.4, 1.5] },
  { crop: 'Cilantro',   min: 0.4,  optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.3, 1.5] },
  { crop: 'Espinaca',   min: 0.44, optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.3, 1.2] },
  { crop: 'Lechuga',    min: 0.5,  optimal: [0.8, 1.2], stress: ['lt', 'gt'], stressLimits: [0.4, 1.5] },
  { crop: 'Pepino',     min: 0.5,  optimal: 1.3,       stress: ['lt', 'gt'], stressLimits: [0.4, 2.8] },
  { crop: 'Pimentón',   min: 0.4,  optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.4, 1.5] },
  { crop: 'Rábano',     min: 0.4,  optimal: 0.7,       stress: ['lt', 'gt'], stressLimits: [0.4, 1.5] },
  { crop: 'Tomate',     min: 0.35, optimal: [0.8, 1.0], stress: ['lt', 'gt'], stressLimits: [0.2, 2.0] },
];
