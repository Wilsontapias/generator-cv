import { describe, it, expect } from "vitest";

import { cvSchema } from "@/schemas/cv";

describe("cvSchema", () => {
  it("debe validar CV completo", () => {
    const validCV = {
      datos: {
        nombre: "Wilson Tapias",
      },
      perfil: "Desarrollador con experiencia en React",
      experiencia: [
        {
          id: "1",
          cargo: "Desarrollador Frontend",
          empresa: "Empresa ABC",
          fechaInicio: "2023-01",
          fechaFin: "actual",
          descripcion: "Desarrollo de interfaces web",
        },
      ],
      estudios: [
        {
          id: "1",
          titulo: "Ingeniería de Sistemas",
          institucion: "Universidad Nacional",
          fechaInicio: "2019",
          fechaFin: "2023",
          descripcion: "Título profesional",
        },
      ],
      habilidades: [
        {
          id: "1",
          nombre: "React",
          nivel: "avanzado",
        },
      ],
      idiomas: [
        {
          id: "1",
          nombre: "Español",
          nivel: "nativo",
        },
      ],
    };

    const result = cvSchema.parse(validCV);
    expect(result.datos.nombre).toBe("Wilson Tapias");
    expect(result.experiencia).toHaveLength(1);
  });
});

describe("cvSchema - validaciones", () => {
  it("debe rechazar más de 10 experiencias", () => {
    const invalidCV = {
      datos: {
        nombre: "Wilson",
      },
      experiencia: Array.from({ length: 11 }, (_, i) => ({
        id: String(i),
        cargo: `Cargo ${i}`,
        empresa: `Empresa ${i}`,
        fechaInicio: "2023-01",
      })),
    };

    expect(() => cvSchema.parse(invalidCV)).toThrow();
  });
});
