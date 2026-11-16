import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ForbiddenError } from "../../src/lib/errors";

vi.mock("@/repositories/cv-repository", () => ({
  crearCV: vi.fn().mockResolvedValue({ id: "cv1" }),
  obtenerCV: vi.fn(),
  obtenerCVsPorUsuario: vi.fn().mockResolvedValue([]),
  actualizarCV: vi.fn().mockResolvedValue({ id: "cv1", titulo: "x" }),
  eliminarCV: vi.fn().mockResolvedValue(true),
  obtenerCVPublico: vi.fn(),
}));

import {
  crearCV,
  obtenerCV,
  obtenerCVsPorUsuario,
  actualizarCV,
  eliminarCV,
  obtenerCVPublico,
  generarCodigoPublico,
} from "../../src/services/cv-service";
import {
  obtenerCV as repoObtener,
  obtenerCVPublico as repoPublico,
} from "@/repositories/cv-repository";

const cvDeOtro = { id: "cv1", uid: "otro-uid" };
const cvPropio = { id: "cv1", uid: "uid1" };

beforeEach(() => {
  vi.mocked(repoObtener).mockReset();
  vi.mocked(repoPublico).mockReset();
});

describe("crearCV", () => {
  it("delega en el repositorio", async () => {
    expect(await crearCV("uid1", {} as never)).toEqual({ id: "cv1" });
  });
});

describe("obtenerCVsPorUsuario", () => {
  it("delega en el repositorio", async () => {
    expect(await obtenerCVsPorUsuario("uid1")).toEqual([]);
  });
});

describe("obtenerCV", () => {
  it("devuelve el CV si es del usuario", async () => {
    vi.mocked(repoObtener).mockResolvedValue(cvPropio as never);
    expect(await obtenerCV("uid1", "cv1")).toEqual(cvPropio);
  });

  it("lanza NotFoundError si no existe", async () => {
    vi.mocked(repoObtener).mockResolvedValue(null);
    await expect(obtenerCV("uid1", "cv1")).rejects.toThrow(NotFoundError);
  });

  it("lanza ForbiddenError si pertenece a otro usuario", async () => {
    vi.mocked(repoObtener).mockResolvedValue(cvDeOtro as never);
    await expect(obtenerCV("uid1", "cv1")).rejects.toThrow(ForbiddenError);
  });
});

describe("actualizarCV", () => {
  it("actualiza si es del dueño", async () => {
    vi.mocked(repoObtener).mockResolvedValue(cvPropio as never);
    expect(await actualizarCV("uid1", "cv1", {} as never)).toEqual({ id: "cv1", titulo: "x" });
  });

  it("lanza NotFoundError si no existe", async () => {
    vi.mocked(repoObtener).mockResolvedValue(null);
    await expect(actualizarCV("uid1", "cv1", {} as never)).rejects.toThrow(NotFoundError);
  });

  it("lanza ForbiddenError si no es del dueño", async () => {
    vi.mocked(repoObtener).mockResolvedValue(cvDeOtro as never);
    await expect(actualizarCV("uid1", "cv1", {} as never)).rejects.toThrow(ForbiddenError);
  });
});

describe("eliminarCV", () => {
  it("elimina si es del dueño", async () => {
    vi.mocked(repoObtener).mockResolvedValue(cvPropio as never);
    expect(await eliminarCV("uid1", "cv1")).toBe(true);
  });

  it("lanza ForbiddenError si no es del dueño", async () => {
    vi.mocked(repoObtener).mockResolvedValue(cvDeOtro as never);
    await expect(eliminarCV("uid1", "cv1")).rejects.toThrow(ForbiddenError);
  });

  it("lanza NotFoundError si no existe", async () => {
    vi.mocked(repoObtener).mockResolvedValue(null);
    await expect(eliminarCV("uid1", "cv1")).rejects.toThrow(NotFoundError);
  });
});

describe("obtenerCVPublico", () => {
  it("devuelve el CV si es público", async () => {
    vi.mocked(repoPublico).mockResolvedValue({ id: "cv1", uid: "u", publica: true } as never);
    expect(await obtenerCVPublico("abc123")).toMatchObject({ id: "cv1" });
  });

  it("lanza NotFoundError si no existe o es privado", async () => {
    vi.mocked(repoPublico).mockResolvedValue(null);
    await expect(obtenerCVPublico("xyz")).rejects.toThrow(NotFoundError);
    vi.mocked(repoPublico).mockResolvedValue({ id: "cv1", uid: "u", publica: false } as never);
    await expect(obtenerCVPublico("xyz")).rejects.toThrow(NotFoundError);
  });
});

describe("generarCodigoPublico", () => {
  it("genera un código de 8 caracteres", () => {
    expect(generarCodigoPublico()).toHaveLength(8);
  });

  it("genera códigos distintos", () => {
    expect(generarCodigoPublico()).not.toBe(generarCodigoPublico());
  });
});
