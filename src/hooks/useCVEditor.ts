import { useState, useCallback, useEffect, useRef } from "react";
import type { CV } from "@/schemas/cv";
import { mensajeDeErrorApi } from "@/utils/apiError";
import { toast } from "sonner";

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

async function updateCV(id: string, titulo: string, data: CV, template: string) {
  const response = await fetch(`/api/cv/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: titulo || data.datos.nombre || "Mi CV",
      plantilla: template,
      datos: data,
    }),
  });

  if (!response.ok) {
    throw new Error(await mensajeDeErrorApi(response, "Error al guardar los cambios"));
  }
}

export function useCVEditor(id: string) {
  const [cvData, setCvData] = useState<CV>(defaultCV);
  const [titulo, setTitulo] = useState("");
  const [template, setTemplate] = useState("moderna");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { isSaving, saveError, guardar, marcarCargado } = useGuardadoCV(id);

  const loadCV = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchCV(id);
      const datos = data.datos || defaultCV;
      const plantilla = data.plantilla || "moderna";
      const tit = data.titulo || datos.datos.nombre || "Mi CV";
      marcarCargado(plantilla, datos, tit);
      setCvData(datos);
      setTitulo(tit);
      setTemplate(plantilla);
    } catch (err) {
      console.error("Error cargando CV:", err);
      setError("Error al cargar el CV");
    } finally {
      setIsLoading(false);
    }
  }, [id, marcarCargado]);

  useEffect(() => {
    loadCV();
  }, [loadCV]);

  return {
    cvData,
    setCvData,
    titulo,
    setTitulo,
    template,
    setTemplate,
    isLoading,
    isSaving,
    error,
    saveError,
    saveCV: (data: CV, tmpl: string) => guardar(data, tmpl, titulo),
  };
}

/**
 * Autoguardado del editor:
 * - No envía nada si el estado no cambió desde la última carga/guardado.
 * - Valida en cliente con el esquema Zod compartido antes de llamar al servidor.
 */
function useGuardadoCV(id: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  // Versión (JSON) del último estado guardado o cargado: si no cambió, no enviamos
  const versionGuardada = useRef("");

  const marcarCargado = useCallback((plantilla: string, datos: CV, titulo: string) => {
    versionGuardada.current = JSON.stringify({ plantilla, titulo, datos });
  }, []);

  const guardar = useCallback(
    async (data: CV, tmpl: string, titulo: string) => {
      const version = JSON.stringify({ plantilla: tmpl, titulo, datos: data });
      if (version === versionGuardada.current) {
        setSaveError("");
        toast.info("Sin cambios que guardar");
        return;
      }

      // Validar en cliente antes de llamar al servidor (mismo esquema Zod).
      // Import diferido: mantiene Zod fuera del JS de carga inicial del editor.
      const { errorDeValidacionLocal } = await import("@/utils/validacionCV");
      const invalido = errorDeValidacionLocal(data);
      if (invalido) {
        setSaveError(invalido);
        toast.error(invalido);
        return;
      }

      try {
        setIsSaving(true);
        await updateCV(id, titulo, data, tmpl);
        versionGuardada.current = version;
        setSaveError("");
        toast.success("Cambios guardados");
      } catch (err) {
        console.error("Error guardando CV:", err);
        const mensaje = err instanceof Error ? err.message : "Error al guardar los cambios.";
        setSaveError(`No se pudieron guardar los cambios: ${mensaje}`);
        toast.error(mensaje);
      } finally {
        setIsSaving(false);
      }
    },
    [id]
  );

  return { isSaving, saveError, guardar, marcarCargado };
}
