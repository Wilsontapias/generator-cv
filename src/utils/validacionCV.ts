// Validación del CV en el cliente antes de enviar al servidor
// Usa el mismo esquema Zod que el servidor para fallar igual y más temprano.

import { cvSchema, type CV } from "@/schemas/cv";

/** Ruta del esquema → nombre visible del campo en el formulario. */
const CAMPOS: Record<string, string> = {
  datos: "Datos Personales",
  "datos.nombre": "Datos Personales → Nombre completo",
  perfil: "Perfil profesional",
  experiencia: "Experiencia",
  estudios: "Estudios",
  habilidades: "Habilidades",
  idiomas: "Idiomas",
  titulo: "Título del CV",
  plantilla: "Plantilla",
};

/**
 * Valida el CV en cliente con el esquema compartido.
 * Devuelve `null` si es válido o un mensaje apto para mostrar al usuario.
 */
export function errorDeValidacionLocal(cv: CV): string | null {
  const resultado = cvSchema.safeParse(cv);
  if (resultado.success) return null;

  const issue = resultado.error.issues[0];
  if (!issue) return "Revisa el formulario: hay datos incompletos.";

  const ruta = issue.path.join(".");
  const campo = CAMPOS[ruta] ?? CAMPOS[String(issue.path[0])] ?? "el formulario";
  return `${issue.message}. Revisa: ${campo}.`;
}
