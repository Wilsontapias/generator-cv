import React from "react";

export default function Loading() {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>Cargando...</p>
    </div>
  );
}
