import { describe, it, expect } from "vitest";
import { formatearRangoFecha } from "../../src/utils/fecha";

describe("formatearRangoFecha", () => {
  it("formatea rango normal", () => {
    expect(formatearRangoFecha("2024-01", "2024-06")).toBe("ene 2024 – jun 2024");
  });

  it("formatea 'actual' cuando fin es actual", () => {
    expect(formatearRangoFecha("2024-01", "actual")).toBe("ene 2024 – actual");
  });

  it("formatea 'actual' cuando fin vacío", () => {
    expect(formatearRangoFecha("2024-01", "")).toBe("ene 2024 – actual");
  });

  it("devuelve solo fin si inicio vacío", () => {
    expect(formatearRangoFecha("", "2024-06")).toBe("jun 2024");
  });
});
