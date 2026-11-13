import { describe, it, expect } from "vitest";

// Importar los esquemas
import { datosPersonalesSchema } from "@/schemas/cv";

describe("datosPersonalesSchema", () => {
  it("debe validar datos personales válidos", () => {
    const validData = {
      nombre: "Wilson Tapias Posada",
      cargo: "Desarrollador Full Stack",
      email: "wilson@example.com",
      telefono: "+57 300 123 4567",
      ciudad: "Medellín, Colombia",
      linkedin: "linkedin.com/in/wilson",
      portfolio: "wilson.dev",
      fotoUrl: null,
    };

    const result = datosPersonalesSchema.parse(validData);
    expect(result.nombre).toBe("Wilson Tapias Posada");
  });

  it("debe rechazar nombre vacío", () => {
    const invalidData = {
      nombre: "",
    };

    expect(() => datosPersonalesSchema.parse(invalidData)).toThrow();
  });

  it("debe rechazar email inválido", () => {
    const invalidData = {
      nombre: "Wilson Tapias",
      email: "email-invalido",
    };

    expect(() => datosPersonalesSchema.parse(invalidData)).toThrow();
  });

  it("debe permitir valores opcionales por defecto", () => {
    const minimalData = {
      nombre: "Wilson",
    };

    const result = datosPersonalesSchema.parse(minimalData);
    expect(result.cargo).toBe("");
    expect(result.email).toBe("");
    expect(result.fotoUrl).toBeNull();
  });
});

describe("fotoUrl", () => {
  it("debe aceptar un pathname válido de foto", () => {
    const result = datosPersonalesSchema.parse({
      nombre: "Wilson",
      fotoUrl: "usuarios/abc123/foto-perfil-Ab12Cd.jpg",
    });
    expect(result.fotoUrl).toBe("usuarios/abc123/foto-perfil-Ab12Cd.jpg");
  });

  it("debe rechazar un pathname de foto inválido", () => {
    expect(() =>
      datosPersonalesSchema.parse({
        nombre: "Wilson",
        fotoUrl: "https://ejemplo.com/foto.jpg",
      })
    ).toThrow();
  });
});
