// Envoltorio común para Route Handlers

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./errors";

interface HandlerResult {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

type Handler = (
  request: Request,
  context: { params: Promise<Record<string, string>> }
) => Promise<HandlerResult | NextResponse>;

/**
 * Envuelve un handler de Route Handler para manejar errores de forma consistente
 */
export function manejar(handler: Handler) {
  return async (
    request: Request,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse> => {
    try {
      const result = await handler(request, context);

      if (result instanceof NextResponse) {
        return result;
      }

      const { status = 200, body, headers } = result;
      const response = NextResponse.json(body ?? null, { status });

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }

      // Cabeceras de seguridad para rutas privadas
      if (!request.url.includes("/api/p/")) {
        response.headers.set("Cache-Control", "no-store");
      }

      return response;
    } catch (error) {
      if (error instanceof ZodError) {
        const detalles = error.errors.map((e) => ({
          campo: e.path.join("."),
          mensaje: e.message,
        }));
        return NextResponse.json({ error: "Error de validación", detalles }, { status: 400 });
      }

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: error.message,
            ...(error.details && { detalles: error.details }),
          },
          { status: error.status }
        );
      }

      // Error genérico (no exponer detalles internos)
      console.error("Error interno:", error);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
  };
}

/**
 * Verifica que la cabecera Origin coincida con el sitio (defensa CSRF)
 */
export function verificarOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin) return true; // Permitir solicitudes sin Origin (same-origin en algunos navegadores)

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}
