import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { manejar } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const POST = manejar(async (request) => {
  const uid = await requerirUsuario(request);

  const body = (await request.json()) as HandleUploadBody;

  const jsonResponse = await handleUpload({
    body,
    request,
    onBeforeGenerateToken: async (pathname) => {
      // Verificar que el pathname empiece por usuarios/<uid>/
      if (!pathname.startsWith(`usuarios/${uid}/`)) {
        throw new Error("Pathname inválido");
      }

      return {
        allowedContentTypes: ALLOWED_TYPES,
        maximumSizeInBytes: MAX_FILE_SIZE,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ uid }),
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      // Notificación de Vercel Blob al terminar
      // En local no funciona sin túnel, por eso el cliente también notifica
      console.warn("Upload completed:", blob.pathname, tokenPayload);
    },
  });

  return {
    body: jsonResponse,
  };
});

// Endpoint para notificación del cliente después de subir
export const PUT = manejar(async (request) => {
  const uid = await requerirUsuario(request);
  const body = await request.json();

  const { pathname, url } = body;

  // Verificar que el pathname sea del usuario
  if (!pathname.startsWith(`usuarios/${uid}/`)) {
    throw new (await import("@/lib/errors")).ForbiddenError("Pathname inválido");
  }

  // Verificar que el archivo exista en Blob
  // (En producción, verificar con get() de @vercel/blob)

  return {
    body: { success: true, pathname, url },
  };
});
