import React from "react";
import { Spinner } from "@/components/ui/Spinner";

interface LoadingOverlayProps {
  message?: string;
}

/** Overlay modal de carga global (bloquea la interacción mientras dura la acción). */
export function LoadingOverlay({ message = "Cargando…" }: LoadingOverlayProps) {
  return (
    <div
      className="modal-overlay loading-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-overlay-content">
        <Spinner />
        <p className="loading-overlay-message">{message}</p>
      </div>
    </div>
  );
}
