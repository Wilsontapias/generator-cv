import { manejar, verificarOrigin } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";
import { crearCvSchema } from "@/schemas/cv";
import { crearCV, obtenerCVsPorUsuario } from "@/services/cv-service";
import { ForbiddenError } from "@/lib/errors";

export const GET = manejar(async (request) => {
  const uid = await requerirUsuario(request);
  const cvs = await obtenerCVsPorUsuario(uid);

  return {
    body: {
      items: cvs,
      siguienteCursor: null,
    },
  };
});

export const POST = manejar(async (request) => {
  if (!verificarOrigin(request)) {
    throw new ForbiddenError("Origen no permitido");
  }

  const uid = await requerirUsuario(request);
  const body = await request.json();
  const data = crearCvSchema.parse(body);

  const cv = await crearCV(uid, data);

  return {
    status: 201,
    body: cv,
  };
});
