import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = ["/mis-cv", "/cv"];

// Rutas de autenticación (si ya está autenticado, redirigir)
const authRoutes = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener la cookie de sesión
  const sessionCookie = request.cookies.get("sesion")?.value;

  // Verificar si la ruta está protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Verificar si es una ruta de autenticación
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Si no hay sesión y la ruta está protegida, redirigir a login
  if (!sessionCookie && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay sesión y la ruta es de autenticación, redirigir a mis-cv
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/mis-cv", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
