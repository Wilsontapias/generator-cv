import { describe, it, expect } from "vitest";
import { errorDeValidacionLocal } from "../../src/utils/validacionCV";
import type { CV } from "../../src/schemas/cv";

function cv(overrides: Partial<CV["datos"]> = {}): CV {
  return {
    datos: {
      nombre: "Wilson Tapias",
      cargo: "",
      email: "wilson@example.com",
      telefono: "",
      ciudad: "",
      linkedin: "",
      portfolio: "",
      fotoUrl: null,
      ...overrides,
    },
    perfil: "",
    experiencia: [],
    estudios: [],
    habilidades: [],
    idiomas: [],
  };
}

describe("errorDeValidacionLocal", () => {
  it("devuelve null cuando el CV es válido", () => {
    expect(errorDeValidacionLocal(cv())).toBeNull();
  });

  it("explica el nombre vacío y señala el campo", () => {
    const mensaje = errorDeValidacionLocal(cv({ nombre: "" }));
    expect(mensaje).toContain("al menos 2 caracteres");
    expect(mensaje).toContain("Datos Personales → Nombre completo");
  });

  it("señala Datos Personales ante un correo inválido", () => {
    const mensaje = errorDeValidacionLocal(cv({ email: "no-es-correo" }));
    expect(mensaje).toContain("Correo electrónico inválido");
    expect(mensaje).toContain("Datos Personales");
  });

  it("señala la sección de experiencia en errores de fechas", () => {
    const conError: CV = {
      ...cv(),
      experiencia: [
        {
          id: "e1",
          cargo: "Dev",
          empresa: "ACME",
          fechaInicio: "2023-05",
          fechaFin: "2022-01",
          descripcion: "",
        },
      ],
    };
    const mensaje = errorDeValidacionLocal(conError);
    expect(mensaje).toContain("Experiencia");
  });
});
