// Utilidades para la foto de perfil almacenada en Vercel Blob (store privado)

const PREFIJO_FOTO = "/api/foto/";

/**
 * Construye la URL de entrega autenticada a partir del pathname almacenado.
 * El pathname tiene el formato `usuarios/<uid>/<archivo>`.
 * La foto se sirve a través de la API, que verifica que el solicitante sea el dueño.
 */
export function urlFoto(pathname: string | null | undefined): string | null {
  if (!pathname) return null;
  return `${PREFIJO_FOTO}${pathname}`;
}
