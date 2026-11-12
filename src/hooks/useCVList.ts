import { useState, useCallback } from "react";

interface CVSummary {
  id: string;
  titulo: string;
  plantilla: string;
  actualizadoEn: string;
}

async function fetchCVs() {
  const response = await fetch("/api/cv");
  if (!response.ok) throw new Error("Error al cargar los CVs");
  const data = await response.json();
  return data.items || [];
}

async function createNewCV() {
  const response = await fetch("/api/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: "Mi CV",
      plantilla: "moderna",
      datos: {
        datos: { nombre: "" },
        perfil: "",
        experiencia: [],
        estudios: [],
        habilidades: [],
        idiomas: [],
      },
    }),
  });
  if (!response.ok) throw new Error("Error al crear CV");
  return response.json();
}

async function removeCV(id: string) {
  const response = await fetch(`/api/cv/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Error al eliminar CV");
}

export function useCVList() {
  const [cvs, setCVs] = useState<CVSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCVs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const items = await fetchCVs();
      setCVs(items);
    } catch (err) {
      console.error("Error cargando CVs:", err);
      setError("Error al cargar los CVs. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCV = useCallback(async () => {
    try {
      const newCV = await createNewCV();
      window.location.href = `/cv/${newCV.id}/editar`;
    } catch (err) {
      console.error("Error creando CV:", err);
      setError("Error al crear el CV. Intenta de nuevo.");
    }
  }, []);

  const deleteCV = useCallback(async (id: string) => {
    try {
      await removeCV(id);
      setCVs((prev) => prev.filter((cv) => cv.id !== id));
    } catch (err) {
      console.error("Error eliminando CV:", err);
      setError("Error al eliminar el CV. Intenta de nuevo.");
    }
  }, []);

  return {
    cvs,
    isLoading,
    error,
    loadCVs,
    createCV,
    deleteCV,
  };
}
