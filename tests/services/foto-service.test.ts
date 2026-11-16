import { describe, it, expect } from "vitest";
import { validarArchivo, mensajeErrorSubida } from "../../src/services/foto-service";

function archivo(tipo: string, bytes = 1024) {
  return new File([new Uint8Array(bytes)], "foto.jpg", { type: tipo });
}

describe("validarArchivo", () => {
  it("acepta JPEG, PNG y WebP dentro del límite", () => {
    expect(validarArchivo(archivo("image/jpeg")).valid).toBe(true);
    expect(validarArchivo(archivo("image/png")).valid).toBe(true);
    expect(validarArchivo(archivo("image/webp")).valid).toBe(true);
  });

  it("rechaza tipos no permitidos", () => {
    const resultado = validarArchivo(archivo("image/gif"));
    expect(resultado.valid).toBe(false);
    expect(resultado.error).toContain("JPEG, PNG o WebP");
  });

  it("rechaza archivos mayores a 5MB", () => {
    const grande = new File([new Uint8Array(10)], "foto.jpg", { type: "image/jpeg" });
    Object.defineProperty(grande, "size", { value: 6 * 1024 * 1024 });
    expect(validarArchivo(grande).valid).toBe(false);
  });
});

describe("mensajeErrorSubida", () => {
  it("explica cuando el servidor no autorizó la subida (token faltante)", () => {
    const error = new Error("Failed to retrieve the client token");
    expect(mensajeErrorSubida(error)).toContain("BLOB_READ_WRITE_TOKEN");
  });

  it("quita el prefijo técnico de Vercel Blob", () => {
    expect(mensajeErrorSubida(new Error("Vercel Blob: algo falló"))).toBe("algo falló");
  });

  it("devuelve un mensaje genérico si no hay error", () => {
    expect(mensajeErrorSubida(undefined)).toBe("Error al subir la foto");
  });
});
