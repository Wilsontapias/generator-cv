import { describe, it, expect, vi } from "vitest";
import { POST, GET } from "../../app/api/cv/route";

// Mock de Firebase Admin
vi.mock("@/lib/firebase-admin", () => ({
  getAdminAuth: () => ({
    verifySessionCookie: vi.fn().mockResolvedValue({ uid: "test-uid" }),
    verifyIdToken: vi.fn().mockResolvedValue({ uid: "test-uid" }),
  }),
  getAdminFirestore: () => ({
    collection: () => ({
      doc: () => ({
        collection: () => ({
          orderBy: () => ({
            get: () => Promise.resolve({ docs: [] }),
          }),
          doc: () => ({
            set: () => Promise.resolve(),
            get: () => Promise.resolve({ exists: false }),
          }),
        }),
      }),
    }),
  }),
}));

describe("API CV - GET", () => {
  it("debe retornar 401 sin sesión", async () => {
    const request = new Request("http://localhost:3000/api/cv", {
      method: "GET",
    });

    const response = await GET(request);
    expect(response.status).toBe(401);
  });
});

describe("API CV - POST", () => {
  it("debe retornar 401 sin sesión", async () => {
    const request = new Request("http://localhost:3000/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: "Test CV" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("debe retornar 400 con datos inválidos", async () => {
    const request = new Request("http://localhost:3000/api/cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "sesion=valid-session-cookie",
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    // Con sesión válida pero datos inválidos, retorna 400
    expect(response.status).toBe(400);
  });
});
