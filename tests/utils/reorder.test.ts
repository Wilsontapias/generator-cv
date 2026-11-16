import { describe, it, expect } from "vitest";
import { moveItem, moveItemUp, moveItemDown } from "../../src/utils/reorder";

describe("moveItem", () => {
  it("mueve un elemento de una posición a otra", () => {
    expect(moveItem(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
  });

  it("no muta el arreglo original", () => {
    const original = ["a", "b", "c"];
    moveItem(original, 0, 1);
    expect(original).toEqual(["a", "b", "c"]);
  });

  it("devuelve el mismo arreglo si origen y destino coinciden", () => {
    expect(moveItem(["a", "b"], 1, 1)).toEqual(["a", "b"]);
  });

  it("ignora origen fuera de rango", () => {
    expect(moveItem(["a", "b"], 5, 1)).toEqual(["a", "b"]);
  });

  it("destino fuera de rango mueve el elemento al final", () => {
    expect(moveItem(["a", "b"], 0, 9)).toEqual(["b", "a"]);
  });
});

describe("moveItemUp", () => {
  it("sube un elemento una posición", () => {
    expect(moveItemUp(["a", "b", "c"], 1)).toEqual(["b", "a", "c"]);
  });

  it("no cambia el primero", () => {
    expect(moveItemUp(["a", "b"], 0)).toEqual(["a", "b"]);
  });

  it("acepta índice negativo sin cambiar nada", () => {
    expect(moveItemUp(["a", "b"], -1)).toEqual(["a", "b"]);
  });
});

describe("moveItemDown", () => {
  it("baja un elemento una posición", () => {
    expect(moveItemDown(["a", "b", "c"], 1)).toEqual(["a", "c", "b"]);
  });

  it("no cambia el último", () => {
    expect(moveItemDown(["a", "b"], 1)).toEqual(["a", "b"]);
  });
});
