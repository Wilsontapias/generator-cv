import { describe, it, expect, vi } from "vitest";
import { reducirImagen, eliminarFoto, generarPathname } from "../../src/services/foto-service";
import { ForbiddenError, NotFoundError } from "../../src/lib/errors";

vi.mock("@vercel/blob", () => ({
  del: vi.fn().mockResolvedValue(undefined),
}));

describe("reducirImagen", () => {
  it("rechaza si la imagen no se puede cargar", async () => {
    const imgStub = {
      set src(_v: string) {
        setTimeout(() => this.onerror?.(new Event("error")), 0);
      },
      onerror: null as ((e?: unknown) => void) | null,
      onload: null as (() => void) | null,
    };
    vi.stubGlobal("Image", function () {
      return imgStub;
    });
    vi.stubGlobal("URL", { createObjectURL: () => "blob:x" });
    vi.stubGlobal("document", { createElement: () => ({ getContext: () => null }) });

    const archivo = new File([new Uint8Array(4)], "foto.jpg", { type: "image/jpeg" });
    await expect(reducirImagen(archivo)).rejects.toThrow("Error al cargar imagen");

    vi.unstubAllGlobals();
  });

  it("rechaza si no hay contexto de canvas", async () => {
    const imgStub = {
      set src(_v: string) {
        setTimeout(() => this.onload?.(), 0);
      },
      onerror: null as (() => void) | null,
      onload: null as (() => void) | null,
      width: 800,
      height: 600,
    };
    vi.stubGlobal("Image", function () {
      return imgStub;
    });
    vi.stubGlobal("URL", { createObjectURL: () => "blob:x" });
    vi.stubGlobal("document", { createElement: () => ({ getContext: () => null }) });

    const archivo = new File([new Uint8Array(4)], "foto.jpg", { type: "image/jpeg" });
    await expect(reducirImagen(archivo)).rejects.toThrow("No se pudo obtener contexto de canvas");

    vi.unstubAllGlobals();
  });
});

describe("eliminarFoto", () => {
  it("lanza ForbiddenError si el pathname no es del usuario", async () => {
    await expect(eliminarFoto("usuarios/otro/foto.jpg", "uid1")).rejects.toThrow(ForbiddenError);
  });

  it("elimina si el pathname es del usuario", async () => {
    await expect(eliminarFoto("usuarios/uid1/foto.jpg", "uid1")).resolves.toBeUndefined();
  });

  it("lanza NotFoundError si el borrado falla", async () => {
    const { del } = await import("@vercel/blob");
    vi.mocked(del).mockRejectedValueOnce(new Error("no existe"));
    await expect(eliminarFoto("usuarios/uid1/foto.jpg", "uid1")).rejects.toThrow(NotFoundError);
  });
});

describe("generarPathname", () => {
  it("usa la extensión del archivo original", () => {
    expect(generarPathname("uid1", "imagen.png")).toBe("usuarios/uid1/foto-perfil.png");
  });

  it("usa la última parte del nombre si no hay punto en la extensión", () => {
    expect(generarPathname("uid1", "imagen")).toBe("usuarios/uid1/foto-perfil.imagen");
  });
});
