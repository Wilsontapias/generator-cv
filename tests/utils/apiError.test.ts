import { describe, it, expect } from "vitest";
import { mensajeDeErrorApi } from "../../src/utils/apiError";

function respuestaCon(body: unknown, status = 400) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("mensajeDeErrorApi", () => {
  it("usa el primer mensaje de validación de Zod", async () => {
    const response = respuestaCon({
      error: "Error de validación",
      detalles: [
        { campo: "datos.datos.nombre", mensaje: "El nombre debe tener al menos 2 caracteres" },
      ],
    });

    expect(await mensajeDeErrorApi(response, "Fallback")).toBe(
      "El nombre debe tener al menos 2 caracteres"
    );
  });

  it("usa el error general cuando no hay detalles", async () => {
    const response = respuestaCon({ error: "Origen no permitido" }, 403);
    expect(await mensajeDeErrorApi(response, "Fallback")).toBe("Origen no permitido");
  });

  it("usa el texto de respaldo cuando el cuerpo no es JSON", async () => {
    const response = new Response("<html>Error</html>", { status: 500 });
    expect(await mensajeDeErrorApi(response, "Fallback")).toBe("Fallback");
  });
});
