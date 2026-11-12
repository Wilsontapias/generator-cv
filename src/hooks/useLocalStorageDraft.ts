import { useState, useEffect, useCallback } from "react";
import type { CV } from "@/schemas/cv";

const DRAFT_KEY = "cv-draft";

export function useLocalStorageDraft() {
  const [hasDraft, setHasDraft] = useState(false);

  const saveDraft = useCallback((data: CV) => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      setHasDraft(true);
    } catch (error) {
      console.error("Error guardando borrador:", error);
    }
  }, []);

  const loadDraft = useCallback((): CV | null => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        return JSON.parse(draft) as CV;
      }
    } catch (error) {
      console.error("Error cargando borrador:", error);
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setHasDraft(false);
    } catch (error) {
      console.error("Error eliminando borrador:", error);
    }
  }, []);

  const checkDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      setHasDraft(!!draft);
    } catch {
      setHasDraft(false);
    }
  }, []);

  useEffect(() => {
    checkDraft();
  }, [checkDraft]);

  return {
    hasDraft,
    saveDraft,
    loadDraft,
    clearDraft,
    checkDraft,
  };
}
