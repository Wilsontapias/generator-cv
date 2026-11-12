"use client";

import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container" role="alert">
      <h2>¡Ups! Algo salió mal</h2>
      <p className="error-message">{error.message || "Ha ocurrido un error inesperado."}</p>
      <button onClick={() => reset()} className="btn btn-primary">
        Intentar de nuevo
      </button>
    </div>
  );
}
