import { describe, it, expect } from "vitest";
import { urlFoto } from "../../src/utils/foto";

describe("urlFoto", () => {
  it("construye la URL autenticada desde el pathname", () => {
    expect(urlFoto("usuarios/uid1/foto.jpg")).toBe("/api/foto/usuarios/uid1/foto.jpg");
  });

  it("devuelve null si no hay pathname", () => {
    expect(urlFoto(null)).toBeNull();
    expect(urlFoto(undefined)).toBeNull();
    expect(urlFoto("")).toBeNull();
  });
});
