"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

interface LoadingContextValue {
  isLoading: boolean;
  message: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Cargando…");

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg || "Cargando…");
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, message, showLoading, hideLoading }}>
      {children}
      {isLoading && <LoadingOverlay message={message} />}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading debe usarse dentro de LoadingProvider");
  return ctx;
}
