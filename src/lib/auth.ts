// Funciones de autenticación compartidas

import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase-admin";
import { ApiError } from "./errors";

export const COOKIE_NAME = "sesion";
const SESSION_DURATION = 5 * 24 * 60 * 60 * 1000; // 5 días

/**
 * Verifica la cookie de sesión y retorna el UID del usuario
 * También acepta Authorization: Bearer <idToken> para testing
 */
export async function requerirUsuario(request?: Request): Promise<string> {
  // Intentar obtener de la cookie de sesión
  let sessionCookie: string | undefined;

  if (request) {
    // Leer de la cabecera Cookie
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          if (key && value) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );
      sessionCookie = cookies[COOKIE_NAME];
    }

    // Intentar Bearer token
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.substring(7);
      try {
        return await getAdminAuth()
          .verifyIdToken(idToken)
          .then((decoded) => decoded.uid);
      } catch {
        throw new AuthError("Token inválido", 401);
      }
    }
  } else {
    // Usar cookies() de Next.js (para Server Components)
    const cookieStore = await cookies();
    sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!sessionCookie) {
    throw new AuthError("No autenticado", 401);
  }

  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch {
    throw new AuthError("Sesión inválida o expirada", 401);
  }
}

/**
 * Obtiene el usuario actual (retorna null si no hay sesión)
 */
export async function obtenerUsuario(): Promise<string | null> {
  try {
    return await requerirUsuario();
  } catch {
    return null;
  }
}

/**
 * Crea una cookie de sesión a partir de un ID token
 */
export async function crearSesion(idToken: string): Promise<string> {
  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION,
    });
    return sessionCookie;
  } catch (error) {
    console.error("Error en createSessionCookie:", error);

    // Intentar verificar el token para obtener más detalles
    try {
      const decoded = await getAdminAuth().verifyIdToken(idToken);
      console.error("Token decodificado:", {
        uid: decoded.uid,
        auth_time: decoded.auth_time,
        iat: decoded.iat,
        exp: decoded.exp,
      });
      const authTime = decoded.auth_time;
      const now = Math.floor(Date.now() / 1000);
      const diff = now - authTime;
      if (diff > 300) {
        throw new Error(
          `El token tiene ${diff} segundos de antigüedad. Se requiere un login reciente (menos de 5 minutos).`
        );
      }
    } catch (verifyError) {
      console.error("Error verificando token:", verifyError);
      throw new Error(
        `Token inválido: ${verifyError instanceof Error ? verifyError.message : "desconocido"}`
      );
    }
    throw error;
  }
}

/**
 * Verifica un ID token (útil para testing con Bruno/Postman)
 */
export async function verificarIdToken(idToken: string): Promise<string> {
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  return decoded.uid;
}

export class AuthError extends ApiError {
  constructor(message: string, status: number) {
    super(message, status);
    this.name = "AuthError";
  }
}
