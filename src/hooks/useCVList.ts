import { useState, useCallback } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { nombreDesdeUsuario } from "@/utils/nombreUsuario";
import { mensajeDeErrorApi } from "@/utils/apiError";

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

async function createNewCV(nombreInicial: string) {
  const response = await fetch("/api/cv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: nombreInicial,
      plantilla: "moderna",
      datos: {
        datos: { nombre: nombreInicial },
        perfil: "",
        experiencia: [],
        estudios: [],
        habilidades: [],
        idiomas: [],
      },
    }),
  });
  if (!response.ok) {
    throw new Error(await mensajeDeErrorApi(response, "Error al crear CV"));
  }
  return response.json();
}

async function removeCV(id: string) {
  const response = await fetch(`/api/cv/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Error al eliminar CV (${response.status})`);
  }
}

export function useCVList() {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [cvs, setCVs] = useState<CVSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isCreating, errorCreacion, limpiarErrorCreacion, createCV } = useCreacionCV(
    user,
    showLoading,
    hideLoading
  );

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

  const deleteCV = useEliminacionCV(showLoading, hideLoading, setCVs, setError);

  return {
    cvs,
    isLoading,
    isCreating,
    error,
    errorCreacion,
    limpiarErrorCreacion,
    loadCVs,
    createCV,
    deleteCV,
  };
}

/** Eliminación de un CV con overlay y notificación toast. */
function useEliminacionCV(
  showLoading: (message?: string) => void,
  hideLoading: () => void,
  setCVs: (updater: (prev: CVSummary[]) => CVSummary[]) => void,
  setError: (value: string) => void
) {
  return useCallback(
    async (id: string) => {
      try {
        showLoading("Eliminando CV…");
        await removeCV(id);
        setCVs((prev) => prev.filter((cv) => cv.id !== id));
        toast.success("CV eliminado");
      } catch (err) {
        console.error("Error eliminando CV:", err);
        setError("Error al eliminar el CV. Intenta de nuevo.");
        toast.error("No se pudo eliminar el CV");
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading, setCVs, setError]
  );
}

/** Creación de un CV nuevo: estado de carga y error propio (no borra la lista). */
function useCreacionCV(
  user: User | null,
  showLoading: (message?: string) => void,
  hideLoading: () => void
) {
  const [isCreating, setIsCreating] = useState(false);
  const [errorCreacion, setErrorCreacion] = useState("");

  const createCV = useCallback(async () => {
    if (isCreating) return; // Evita crear dos CVs con doble clic
    try {
      setIsCreating(true);
      setErrorCreacion("");
      showLoading("Creando CV…");
      const newCV = await createNewCV(nombreDesdeUsuario(user));
      toast.success("CV creado");
      window.location.href = `/cv/${newCV.id}/editar`;
    } catch (err) {
      console.error("Error creando CV:", err);
      setErrorCreacion(err instanceof Error ? err.message : "Error al crear el CV.");
      toast.error(err instanceof Error ? err.message : "Error al crear el CV");
      setIsCreating(false);
      hideLoading();
    }
  }, [user, isCreating, showLoading, hideLoading]);

  const limpiarErrorCreacion = useCallback(() => setErrorCreacion(""), []);

  return { isCreating, errorCreacion, limpiarErrorCreacion, createCV };
}
