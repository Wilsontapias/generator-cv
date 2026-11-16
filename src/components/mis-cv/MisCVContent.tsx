"use client";

import React from "react";
import Link from "next/link";
import "@/styles/mis-cv.css";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { useLoading } from "@/hooks/useLoading";

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

export function EmptyState({
  onCreateCV,
  isCreating = false,
}: {
  onCreateCV: () => void;
  isCreating?: boolean;
}) {
  return (
    <div className="page-container">
      <h1>Mis Hojas de Vida</h1>
      <div className="empty-state" data-reveal suppressHydrationWarning>
        <div className="empty-icon">
          <Icon name="file" />
        </div>
        <h2>Aún no tienes hojas de vida</h2>
        <p>Crea tu primera hoja de vida y comienza tu búsqueda de empleo.</p>
        <button
          onClick={onCreateCV}
          className="btn btn-primary btn-lg"
          disabled={isCreating}
          aria-busy={isCreating}
        >
          {isCreating ? <Spinner /> : <Icon name="plus" />}
          {isCreating ? "Creando…" : "Crear mi primer CV"}
        </button>
      </div>
    </div>
  );
}

export function CVList({
  cvs,
  onCreateCV,
  onDeleteCV,
  isCreating = false,
}: {
  cvs: CVSummary[];
  onCreateCV: () => void;
  onDeleteCV: (id: string) => void;
  isCreating?: boolean;
}) {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mis Hojas de Vida</h1>
        <button
          onClick={onCreateCV}
          className="btn btn-primary"
          disabled={isCreating}
          aria-busy={isCreating}
        >
          {isCreating ? <Spinner /> : <Icon name="plus" />}
          {isCreating ? "Creando…" : "Nuevo CV"}
        </button>
      </div>

      <div className="cv-grid">
        {cvs.map((cv, index) => (
          <CVCard key={cv.id} cv={cv} index={index} onDeleteCV={onDeleteCV} />
        ))}
      </div>
    </div>
  );
}

function CVCard({
  cv,
  index,
  onDeleteCV,
}: {
  cv: CVSummary;
  index: number;
  onDeleteCV: (id: string) => void;
}) {
  return (
    <article
      className="cv-card"
      data-reveal
      suppressHydrationWarning
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="cv-card-header">
        <h2>{cv.titulo}</h2>
        <span className="cv-template-badge">{cv.plantilla}</span>
      </div>
      <p className="cv-date">
        Actualizado: {new Date(cv.actualizadoEn).toLocaleDateString("es-CO")}
      </p>
      <CVCardActions cv={cv} onDeleteCV={onDeleteCV} />
    </article>
  );
}

function CVCardActions({ cv, onDeleteCV }: { cv: CVSummary; onDeleteCV: (id: string) => void }) {
  const { showLoading } = useLoading();
  return (
    <div className="cv-card-actions">
      <Link
        href={`/cv/${cv.id}/editar`}
        className="btn btn-secondary btn-icon"
        title="Editar"
        aria-label={`Editar ${cv.titulo}`}
        onClick={() => showLoading("Cargando editor…")}
      >
        <Icon name="editor" />
      </Link>
      <Link
        href={`/cv/${cv.id}/imprimir`}
        className="btn btn-secondary btn-icon"
        title="Imprimir"
        aria-label={`Imprimir ${cv.titulo}`}
        onClick={() => showLoading("Preparando impresión…")}
      >
        <Icon name="print" />
      </Link>
      <button
        onClick={() => onDeleteCV(cv.id)}
        className="btn btn-danger btn-icon"
        title="Eliminar"
        aria-label={`Eliminar ${cv.titulo}`}
      >
        <Icon name="trash" />
      </button>
    </div>
  );
}
