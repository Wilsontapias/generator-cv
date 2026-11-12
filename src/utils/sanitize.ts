// Utilidades de seguridad para contenido de usuarios

/**
 * Escapa caracteres HTML para prevenir XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

/**
 * Sanitiza texto de usuario (escapa HTML y elimina scripts)
 */
export function sanitizeText(text: string): string {
  // Primero escapar HTML
  let sanitized = escapeHtml(text);

  // Eliminar cualquier tag script que haya pasado
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  return sanitized;
}

/**
 * Valida que un texto no contenga HTML
 */
export function containsHtml(text: string): boolean {
  const htmlPattern = /<[^>]*>/;
  return htmlPattern.test(text);
}

/**
 * Limpia texto de entrada (trim y normalización de espacios)
 */
export function cleanInput(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
