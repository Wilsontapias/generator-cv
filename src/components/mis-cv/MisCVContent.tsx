"use client";

import React from "react";
import Link from "next/link";
import "@/styles/mis-cv.css";

interface CVSummary {
  id: string;
  titulo: string;
  plantilla: string;
  actualizadoEn: string;
}

export function LoadingState() {
  return (
    <div className="page-container">
      <h1>Mis Hojas de Vida</h1>
      <div className="loading-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="cv-card-skeleton" />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="page-container">
      <h1>Mis Hojas de Vida</h1>
      <div className="error-state" role="alert">
        <p>{error}</p>
        <button onClick={onRetry} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ onCreateCV }: { onCreateCV: () => void }) {
  return (
    <div className="page-container">
      <h1>Mis Hojas de Vida</h1>
      <div className="empty-state">
        <div className="empty-icon" aria-hidden="true">
          📄
        </div>
        <h2>Aún no tienes hojas de vida</h2>
        <p>Crea tu primera hoja de vida y comienza tu búsqueda de empleo.</p>
        <button onClick={onCreateCV} className="btn btn-primary btn-lg">
          Crear mi primer CV
        </button>
      </div>
    </div>
  );
}

export function CVList({
  cvs,
  onCreateCV,
  onDeleteCV,
}: {
  cvs: CVSummary[];
  onCreateCV: () => void;
  onDeleteCV: (id: string) => void;
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mis Hojas de Vida</h1>
        <button onClick={onCreateCV} className="btn btn-primary">
          Nuevo CV
        </button>
      </div>

      <div className="cv-grid">
        {cvs.map((cv) => (
          <article key={cv.id} className="cv-card">
            <div className="cv-card-header">
              <h2>{cv.titulo}</h2>
              <span className="cv-template-badge">{cv.plantilla}</span>
            </div>
            <p className="cv-date">
              Actualizado: {new Date(cv.actualizadoEn).toLocaleDateString("es-CO")}
            </p>
            <div className="cv-card-actions">
              <Link href={`/cv/${cv.id}/editar`} className="btn btn-secondary">
                Editar
              </Link>
              <Link href={`/cv/${cv.id}/imprimir`} className="btn btn-secondary">
                Imprimir
              </Link>
              <button
                onClick={() => onDeleteCV(cv.id)}
                className="btn btn-danger"
                aria-label={`Eliminar ${cv.titulo}`}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
