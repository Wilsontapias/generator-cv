import { describe, it, expect, vi } from "vitest";
import { GET } from "../../app/api/foto/[...pathname]/route";
import { get } from "@vercel/blob";

// Mock de Vercel Blob
vi.mock("@vercel/blob", () => ({
  get: vi.fn(),
}));

// Mock de Firebase Admin
vi.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: () => ({
    verifySessionCookie: vi.fn().mockResolvedValue({ uid: "test-uid" }),
    verifyIdToken: vi.fn().mockResolvedValue({ uid: "test-uid" }),
  }),
}));

const contexto = (pathname: string[]) => ({ params: Promise.resolve({ pathname }) });

describe("API Foto - GET", () => {
  it("debe retornar 401 sin sesión", async () => {
    const request = new Request("http://localhost:3000/api/foto/usuarios/test-uid/foto.jpg");

    const response = await GET(request, contexto(["usuarios", "test-uid", "foto.jpg"]));
    expect(response.status).toBe(401);
  });

  it("debe retornar 403 al pedir la foto de otro usuario", async () => {
    const request = new Request("http://localhost:3000/api/foto/usuarios/otro/foto.jpg", {
      headers: { Cookie: "sesion=valid-session-cookie" },
    });

    const response = await GET(request, contexto(["usuarios", "otro", "foto.jpg"]));
    expect(response.status).toBe(403);
  });

  it("debe entregar la foto del dueño", async () => {
    vi.mocked(get).mockResolvedValueOnce({
      statusCode: 200,
      stream: null,
      headers: new Headers(),
      blob: { contentType: "image/jpeg", size: 1 },
    } as never);

    const request = new Request("http://localhost:3000/api/foto/usuarios/test-uid/foto.jpg", {
      headers: { Cookie: "sesion=valid-session-cookie" },
    });

    const response = await GET(request, contexto(["usuarios", "test-uid", "foto.jpg"]));
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("image/jpeg");
  });

  it("debe retornar 404 si el blob no existe", async () => {
    vi.mocked(get).mockResolvedValueOnce(null);

    const request = new Request("http://localhost:3000/api/foto/usuarios/test-uid/foto.jpg", {
      headers: { Cookie: "sesion=valid-session-cookie" },
    });

    const response = await GET(request, contexto(["usuarios", "test-uid", "foto.jpg"]));
    expect(response.status).toBe(404);
  });
});
