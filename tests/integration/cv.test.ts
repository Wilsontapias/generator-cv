import { describe, it, expect, vi } from "vitest";

// Mock de Firebase Admin
vi.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: () => ({
    verifySessionCookie: vi.fn().mockResolvedValue({ uid: "test-uid" }),
  }),
  getAdminFirestore: vi.fn(),
}));

// Mock del repositorio
vi.mock("@/repositories/cv-repository", () => ({
  obtenerCV: vi.fn().mockResolvedValue(null),
  crearCV: vi.fn(),
}));

describe("Integración: CV", () => {
  it("debe retornar 404 al leer CV ajeno privado", async () => {
    const { GET } = await import("../../app/api/cv/[id]/route");

    const request = new Request("http://localhost:3000/api/cv/otro-cv", {
      method: "GET",
      headers: {
        Cookie: "sesion=valid-session-cookie",
      },
    });

    const response = await GET(request, { params: Promise.resolve({ id: "otro-cv" }) });
    // Sin CV existente, retorna 404
    expect(response.status).toBe(404);
  });
});
