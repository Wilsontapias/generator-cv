// Servicio de reglas de negocio para CVs

import { NotFoundError, ForbiddenError } from "@/lib/errors";
import {
  crearCV as repoCrear,
  obtenerCV as repoObtener,
  obtenerCVsPorUsuario as repoObtenerTodos,
  actualizarCV as repoActualizar,
  eliminarCV as repoEliminar,
  obtenerCVPublico as repoObtenerPublico,
} from "@/repositories/cv-repository";
import type { CrearCV, ActualizarCV } from "@/schemas/cv";

export async function crearCV(uid: string, data: CrearCV) {
  return repoCrear(uid, data);
}

export async function obtenerCV(uid: string, id: string) {
  const cv = await repoObtener(uid, id);
  if (!cv) {
    throw new NotFoundError("CV no encontrado");
  }
  if (cv.uid !== uid) {
    throw new ForbiddenError("Sin permiso para acceder a este CV");
  }
  return cv;
}

export async function obtenerCVsPorUsuario(uid: string) {
  return repoObtenerTodos(uid);
}

export async function actualizarCV(uid: string, id: string, data: ActualizarCV) {
  const cv = await repoObtener(uid, id);
  if (!cv) {
    throw new NotFoundError("CV no encontrado");
  }
  if (cv.uid !== uid) {
    throw new ForbiddenError("Sin permiso para modificar este CV");
  }
  return repoActualizar(uid, id, data);
}

export async function eliminarCV(uid: string, id: string) {
  const cv = await repoObtener(uid, id);
  if (!cv) {
    throw new NotFoundError("CV no encontrado");
  }
  if (cv.uid !== uid) {
    throw new ForbiddenError("Sin permiso para eliminar este CV");
  }
  return repoEliminar(uid, id);
}

export async function obtenerCVPublico(codigo: string) {
  const cv = await repoObtenerPublico(codigo);
  if (!cv || !cv.publica) {
    throw new NotFoundError("CV no encontrado");
  }
  return cv;
}

export function generarCodigoPublico(): string {
  return crypto.randomUUID().substring(0, 8);
}
