import { useState, useCallback, useEffect } from "react";
import type { CV } from "@/schemas/cv";

const defaultCV: CV = {
  datos: {
    nombre: "",
    cargo: "",
    email: "",
    telefono: "",
    ciudad: "",
    linkedin: "",
    portfolio: "",
    fotoUrl: null,
  },
  perfil: "",
  experiencia: [],
  estudios: [],
  habilidades: [],
  idiomas: [],
};

async function fetchCV(id: string) {
  const response = await fetch(`/api/cv/${id}`);
  if (!response.ok) throw new Error("Error al cargar CV");
  return response.json();
}

async function updateCV(id: string, data: CV, template: string) {
  await fetch(`/api/cv/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: data.datos.nombre || "Mi CV",
      plantilla: template,
      datos: data,
    }),
  });
}

export function useCVEditor(id: string) {
  const [cvData, setCvData] = useState<CV>(defaultCV);
  const [template, setTemplate] = useState("moderna");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCV = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchCV(id);
      setCvData(data.datos || defaultCV);
      setTemplate(data.plantilla || "moderna");
    } catch (err) {
      console.error("Error cargando CV:", err);
      setError("Error al cargar el CV");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveCV = useCallback(
    async (data: CV, tmpl: string) => {
      try {
        setIsSaving(true);
        await updateCV(id, data, tmpl);
      } catch (err) {
        console.error("Error guardando CV:", err);
      } finally {
        setIsSaving(false);
      }
    },
    [id]
  );

  useEffect(() => {
    loadCV();
  }, [loadCV]);

  return {
    cvData,
    setCvData,
    template,
    setTemplate,
    isLoading,
    isSaving,
    error,
    saveCV,
  };
}
