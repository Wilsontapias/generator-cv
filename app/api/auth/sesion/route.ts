import { NextResponse } from "next/server";
import { z } from "zod";
import { manejar } from "@/lib/http";
import { requerirUsuario, crearSesion } from "@/lib/auth";
import { getAdminAuth } from "@/lib/firebase-admin";

const sesionSchema = z.object({
  idToken: z.string().min(1, "idToken es obligatorio"),
});

export const POST = manejar(async (request) => {
  const body = await request.json();
  const { idToken } = sesionSchema.parse(body);

  try {
    const sessionCookie = await crearSesion(idToken);

    const response = new NextResponse(null, { status: 204 });
    response.cookies.set("sesion", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 5 * 24 * 60 * 60, // 5 días
    });

    return response;
  } catch (error) {
    console.error("Error creando sesión:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    throw new (await import("@/lib/errors")).ApiError(
      `Error al crear sesión: ${errorMessage}`,
      401
    );
  }
});

export const DELETE = manejar(async (request) => {
  const uid = await requerirUsuario(request);

  // Revocar refresh tokens
  try {
    await getAdminAuth().revokeRefreshTokens(uid);
  } catch {
    // Ignorar errores de revocación
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete("sesion");

  return response;
});

export const GET = manejar(async (request) => {
  const uid = await requerirUsuario(request);
  const user = await getAdminAuth().getUser(uid);

  return {
    body: {
      usuario: {
        uid: user.uid,
        correo: user.email || null,
        rol: user.customClaims?.rol || "usuario",
      },
    },
  };
});
