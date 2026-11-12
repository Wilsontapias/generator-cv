import { manejar, verificarOrigin } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";
import { actualizarCvSchema } from "@/schemas/cv";
import { obtenerCV, actualizarCV, eliminarCV } from "@/services/cv-service";

export const GET = manejar(async (request, context) => {
  const uid = await requerirUsuario(request);
  const params = await context.params;
  const id = params?.id || "";
  const cv = await obtenerCV(uid, id);

  return {
    body: cv,
  };
});

export const PUT = manejar(async (request, context) => {
  if (!verificarOrigin(request)) {
    throw new (await import("@/lib/errors")).ForbiddenError("Origen no permitido");
  }

  const uid = await requerirUsuario(request);
  const body = await request.json();
  const data = actualizarCvSchema.parse(body);
  const params = await context.params;
  const id = params?.id || "";

  const cv = await actualizarCV(uid, id, data);

  return {
    body: cv,
  };
});

export const DELETE = manejar(async (request, context) => {
  if (!verificarOrigin(request)) {
    throw new (await import("@/lib/errors")).ForbiddenError("Origen no permitido");
  }

  const uid = await requerirUsuario(request);
  const params = await context.params;
  const id = params?.id || "";

  await eliminarCV(uid, id);

  return {
    status: 204,
    body: null,
  };
});
