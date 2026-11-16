// Utilidades para interpretar respuestas de error de la API en el cliente

interface CuerpoErrorApi {
  error?: string;
  detalles?: Array<{ campo?: string; mensaje?: string }>;
}

/**
 * Extrae un mensaje apto para mostrar al usuario desde una respuesta JSON de la API.
 * Si la API devolvió errores de validación de Zod, usa el primer mensaje de `detalles`.
 */
export async function mensajeDeErrorApi(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as CuerpoErrorApi | null;
  const primerDetalle = body?.detalles?.[0]?.mensaje;
  if (primerDetalle) return primerDetalle;
  if (body?.error) return body.error;
  return fallback;
}
