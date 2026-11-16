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

export const DELETE = async (request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    if (!verificarOrigin(request)) {
      return Response.json({ error: "Origen no permitido" }, { status: 403 });
    }

    const uid = await requerirUsuario(request);
    const params = await context.params;
    const id = params?.id || "";

    console.error("DELETE DIAG: uid=", uid, "id=", id);

    try {
      await eliminarCV(uid, id);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "Error desconocido";
      const stack = error instanceof Error ? error.stack : "";
      console.error("DELETE CV error:", mensaje, stack);
      return Response.json({ error: `[diag] ${mensaje}` }, { status: 500 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    console.error("DELETE outer error:", mensaje, error instanceof Error ? error.stack : "");
    return Response.json({ error: `[diag-outer] ${mensaje}` }, { status: 500 });
  }
};
