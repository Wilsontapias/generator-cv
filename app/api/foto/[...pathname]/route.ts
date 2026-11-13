import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { manejar } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";
import { ForbiddenError, NotFoundError } from "@/lib/errors";

/**
 * Entrega una foto de perfil almacenada en un store privado de Vercel Blob.
 * Verifica que el solicitante sea el dueño (pathname `usuarios/<uid>/...`).
 */
export const GET = manejar<{ pathname: string[] }>(async (request, context) => {
  const uid = await requerirUsuario(request);
  const { pathname } = await context.params;
  const ruta = (pathname ?? []).join("/");

  if (!ruta.startsWith(`usuarios/${uid}/`)) {
    throw new ForbiddenError("Sin permiso para acceder a esta foto");
  }

  const resultado = await get(ruta, { access: "private" });

  if (!resultado || resultado.statusCode !== 200) {
    throw new NotFoundError("Foto no encontrada");
  }

  return new NextResponse(resultado.stream, {
    status: 200,
    headers: {
      "Content-Type": resultado.blob.contentType,
      "Cache-Control": "private, max-age=60",
    },
  });
});
