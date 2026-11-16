import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { manejar } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";
import { ApiError } from "@/lib/errors";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MENSAJE_TOKEN =
  "Falta la variable de entorno BLOB_READ_WRITE_TOKEN. Configura el token de tu store de Vercel Blob en Vercel (Settings → Environment Variables) y en .env.local para desarrollo.";

export const POST = manejar(async (request) => {
  const uid = await requerirUsuario(request);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new ApiError(MENSAJE_TOKEN, 500);
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Verificar que el pathname empiece por usuarios/<uid>/
        if (!pathname.startsWith(`usuarios/${uid}/`)) {
          throw new ApiError("Pathname inválido: debe pertenecer a tu cuenta", 403);
        }

        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ uid }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Notificación de Vercel Blob al terminar.
        // En local no funciona sin túnel, por eso el cliente también notifica.
        console.warn("Upload completado:", blob.pathname, "payload:", Boolean(tokenPayload));
      },
    });

    return { body: jsonResponse };
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "";
    if (mensaje.startsWith("Vercel Blob:")) {
      throw new ApiError(`No se pudo generar el token de subida. ${mensaje}`, 500);
    }
    throw error;
  }
});

// Endpoint para notificación del cliente después de subir
export const PUT = manejar(async (request) => {
  const uid = await requerirUsuario(request);
  const body = await request.json();

  const { pathname, url } = body;

  // Verificar que el pathname sea del usuario
  if (typeof pathname !== "string" || !pathname.startsWith(`usuarios/${uid}/`)) {
    throw new ApiError("Pathname inválido: debe pertenecer a tu cuenta", 403);
  }

  return {
    body: { success: true, pathname, url },
  };
});
