import { useState, useEffect } from "react";

interface CVData {
  titulo: string;
  plantilla: string;
  datos: {
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
    ciudad: string;
    linkedin: string;
    fotoUrl: string | null;
  };
  perfil: string;
  experiencia: Array<{
    id: string;
    cargo: string;
    empresa: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
  }>;
  estudios: Array<{
    id: string;
    titulo: string;
    institucion: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
  }>;
  habilidades: Array<{
    id: string;
    nombre: string;
    nivel: string;
  }>;
  idiomas: Array<{
    id: string;
    nombre: string;
    nivel: string;
  }>;
}

async function fetchPublicCV(codigo: string) {
  const response = await fetch(`/api/p/${codigo}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("CV no encontrado o no disponible públicamente");
    }
    throw new Error("Error al cargar el CV");
  }
  return response.json();
}

export function usePublicCV(codigo: string) {
  const [cv, setCv] = useState<CVData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCV = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPublicCV(codigo);
        setCv(data);
      } catch (err) {
        console.error("Error cargando CV público:", err);
        setError(err instanceof Error ? err.message : "Error al cargar el CV. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    if (codigo) {
      loadCV();
    }
  }, [codigo]);

  return { cv, isLoading, error };
}
