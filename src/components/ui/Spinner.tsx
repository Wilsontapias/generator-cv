import React from "react";

interface SpinnerProps {
  /** Texto accesible; si el botón ya describe el estado, déjalo vacío. */
  label?: string;
}

/**
 * Indicador de carga animado (solo visual).
 * Respeta `prefers-reduced-motion`: se queda estático sin girar.
 */
export function Spinner({ label }: SpinnerProps) {
  return (
    <span className="spinner" aria-hidden={label ? undefined : "true"}>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
