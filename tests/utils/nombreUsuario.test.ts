import { describe, it, expect } from "vitest";
import { nombreDesdeUsuario } from "../../src/utils/nombreUsuario";

describe("nombreDesdeUsuario", () => {
  it("usa el displayName cuando existe", () => {
    expect(nombreDesdeUsuario({ displayName: "Wilson Tapias", email: "otro@x.com" })).toBe(
      "Wilson Tapias"
    );
  });

  it("deriva el nombre del correo cuando no hay displayName", () => {
    expect(nombreDesdeUsuario({ displayName: null, email: "wilson.tapias@ejemplo.com" })).toBe(
      "Wilson Tapias"
    );
  });

  it("ignora espacios sobrantes en el displayName", () => {
    expect(nombreDesdeUsuario({ displayName: "  Ana López  " })).toBe("Ana López");
  });

  it("devuelve 'Usuario' sin perfil", () => {
    expect(nombreDesdeUsuario(null)).toBe("Usuario");
    expect(nombreDesdeUsuario({})).toBe("Usuario");
  });
});
