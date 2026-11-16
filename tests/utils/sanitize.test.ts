import { describe, it, expect } from "vitest";
import { escapeHtml, sanitizeText, containsHtml, cleanInput } from "../../src/utils/sanitize";

describe("escapeHtml", () => {
  it("escapa los cinco caracteres peligrosos", () => {
    expect(escapeHtml(`<script>"'&`)).toBe("&lt;script&gt;&quot;&#39;&amp;");
  });

  it("deja el texto normal igual", () => {
    expect(escapeHtml("Desarrollador Frontend")).toBe("Desarrollador Frontend");
  });
});

describe("sanitizeText", () => {
  it("escapa HTML de contenido de usuario", () => {
    expect(sanitizeText("<b>hola</b>")).toBe("&lt;b&gt;hola&lt;/b&gt;");
  });

  it("elimina etiquetas script completas", () => {
    const resultado = sanitizeText("<script>alert(1)</script>texto");
    expect(resultado).not.toContain("<script");
    expect(resultado).toContain("texto");
  });
});

describe("containsHtml", () => {
  it("detecta etiquetas HTML", () => {
    expect(containsHtml("<div>")).toBe(true);
    expect(containsHtml("texto <img src=x>")).toBe(true);
  });

  it("no marca texto normal como HTML", () => {
    expect(containsHtml("Ingeniero de sistemas")).toBe(false);
  });
});

describe("cleanInput", () => {
  it("recorta espacios y colapsa espacios internos", () => {
    expect(cleanInput("  hola   mundo  ")).toBe("hola mundo");
  });
});
