import { manejar, verificarOrigin } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";
import { asignarRol, obtenerRol, esAdmin, ROLES } from "@/lib/roles";
import { z } from "zod";

const asignarRolSchema = z.object({
  uid: z.string().min(1, "UID es obligatorio"),
  rol: z.enum(["usuario", "admin", "moderador"]),
});

// GET /api/admin/roles?uid=xxx - Obtener rol de un usuario
export const GET = manejar(async (request) => {
  const uid = await requerirUsuario(request);

  // Solo admins pueden ver roles
  if (!(await esAdmin(uid))) {
    throw new (await import("@/lib/errors")).ForbiddenError(
      "Solo administradores pueden ver roles"
    );
  }

  const url = new URL(request.url);
  const targetUid = url.searchParams.get("uid");

  if (!targetUid) {
    throw new (await import("@/lib/errors")).ValidationError("UID es obligatorio", [
      { campo: "uid", mensaje: "Parámetro uid es obligatorio" },
    ]);
  }

  const rol = await obtenerRol(targetUid);

  return {
    body: { uid: targetUid, rol },
  };
});

// POST /api/admin/roles - Asignar rol a un usuario
export const POST = manejar(async (request) => {
  if (!verificarOrigin(request)) {
    throw new (await import("@/lib/errors")).ForbiddenError("Origen no permitido");
  }

  const uid = await requerirUsuario(request);

  // Solo admins pueden asignar roles
  if (!(await esAdmin(uid))) {
    throw new (await import("@/lib/errors")).ForbiddenError(
      "Solo administradores pueden asignar roles"
    );
  }

  const body = await request.json();
  const { uid: targetUid, rol } = asignarRolSchema.parse(body);

  await asignarRol(targetUid, rol);

  return {
    body: { uid: targetUid, rol, message: "Rol asignado correctamente" },
  };
});

// GET /api/admin/roles/list - Listar roles disponibles
export const PUT = manejar(async (request) => {
  const uid = await requerirUsuario(request);

  if (!(await esAdmin(uid))) {
    throw new (await import("@/lib/errors")).ForbiddenError(
      "Solo administradores pueden ver roles"
    );
  }

  return {
    body: { roles: ROLES },
  };
});
