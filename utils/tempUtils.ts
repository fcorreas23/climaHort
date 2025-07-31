

export function getTempStatus(temperature: number, crop: string): string {
    type VPDRange = {
        optimalMin: number;
        optimalMax: number;
        acceptableMin: number;
        acceptableMax: number;
    };

    const vpdReference: Record<string, VPDRange> = {
        Acelga:     { optimalMin: 18, optimalMax: 20, acceptableMin: 15, acceptableMax: 24 },
        Ajo:        { optimalMin: 18, optimalMax: 22, acceptableMin: 15, acceptableMax: 28 },
        Betarraga:  { optimalMin: 18, optimalMax: 22, acceptableMin: 12, acceptableMax: 28 },
        Cilantro:   { optimalMin: 18, optimalMax: 22, acceptableMin: 13, acceptableMax: 28 },
        Espinaca:   { optimalMin: 18, optimalMax: 22, acceptableMin: 10, acceptableMax: 28 },
        Lechuga:    { optimalMin: 16, optimalMax: 20, acceptableMin: 12, acceptableMax: 26 },
        Pepino:     { optimalMin: 22, optimalMax: 25, acceptableMin: 15, acceptableMax: 30 },
        Pimentón:   { optimalMin: 20, optimalMax: 24, acceptableMin: 16, acceptableMax: 30 },
        Rábano:     { optimalMin: 16, optimalMax: 18, acceptableMin: 10, acceptableMax: 28 },
        Tomate:     { optimalMin: 22, optimalMax: 25, acceptableMin: 17, acceptableMax: 28 },
    };
    const range = vpdReference[crop];
    if (!range) return "Cultivo no reconocido";
    
    if (temperature >= range.optimalMin && temperature <= range.optimalMax) return "Óptima";
    if (temperature >= range.acceptableMin && temperature <= range.acceptableMax) return "Aceptable";
    if (temperature < range.acceptableMin) return "Baja";
    if (temperature > range.acceptableMax) return "Alta";
    
    return "Fuera de rango";
}