import diagnostico_json from '@/store/diagnostico_recomendaciones.json'

interface Diagnostico {
  mensaje: string;
  recomendacion: string;
  patogenos: string;
}

export function getDiagnostic( vpdEstado: string, humedadSuelo: string): Diagnostico {
    const resultado = diagnostico_json.find((item) => item.vpd === vpdEstado && item.humedad_suelo === humedadSuelo);

    if (resultado) {
    return {
      mensaje: resultado.diagnostico,
      recomendacion: resultado.recomendacion,
      patogenos: resultado.riesgo_patogenos
    };
  } else {
    return {
      mensaje: "❓ Sin diagnóstico definido para esta combinación.",
      recomendacion: "Revisa los datos ingresados.",
      patogenos: "Desconocido"
    };
  }
}
