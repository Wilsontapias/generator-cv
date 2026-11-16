// Derivación de un nombre visible a partir del perfil de Firebase Auth

interface DatosUsuario {
  displayName?: string | null;
  email?: string | null;
}

/**
 * Devuelve un nombre legible para mostrar al usuario.
 * Usa el displayName si existe; si no, capitaliza la parte local del correo
 * (wilson.tapias@ejemplo.com → "Wilson Tapias").
 */
export function nombreDesdeUsuario(user: DatosUsuario | null | undefined): string {
  const displayName = user?.displayName?.trim();
  if (displayName) return displayName;

  const local = (user?.email?.split("@")[0] ?? "").trim();
  const partes = local.split(/[._\-+]+/).filter(Boolean);
  const capitalizado = partes
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");

  return capitalizado || "Usuario";
}
