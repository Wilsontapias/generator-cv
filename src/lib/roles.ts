// Gestión de roles con custom claims de Firebase

import "server-only";

import { getAdminAuth } from "@/lib/firebase-admin";

export type Rol = "usuario" | "admin" | "moderador";

export const ROLES: Rol[] = ["usuario", "admin", "moderador"];

/**
 * Asigna un rol a un usuario mediante custom claims
 */
export async function asignarRol(uid: string, rol: Rol): Promise<void> {
  if (!ROLES.includes(rol)) {
    throw new Error(`Rol inválido: ${rol}`);
  }

  await getAdminAuth().setCustomUserClaims(uid, { rol });
}

/**
 * Obtiene el rol de un usuario
 */
export async function obtenerRol(uid: string): Promise<Rol> {
  const user = await getAdminAuth().getUser(uid);
  const rol = user.customClaims?.rol as Rol | undefined;
  return rol || "usuario";
}

/**
 * Verifica si un usuario tiene un rol específico
 */
export async function tieneRol(uid: string, rol: Rol): Promise<boolean> {
  const userRol = await obtenerRol(uid);
  return userRol === rol;
}

/**
 * Verifica si un usuario es admin
 */
export async function esAdmin(uid: string): Promise<boolean> {
  return tieneRol(uid, "admin");
}

/**
 * Verifica si un usuario es moderador o admin
 */
export async function esModeradorOAdmin(uid: string): Promise<boolean> {
  const rol = await obtenerRol(uid);
  return rol === "moderador" || rol === "admin";
}
