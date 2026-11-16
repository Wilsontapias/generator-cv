"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useLoading } from "@/hooks/useLoading";

export function EditorHeader({
  cvId,
  titulo,
  setTitulo,
  template,
  onTemplateChange,
  onSave,
  isSaving,
  canSave,
}: {
  cvId: string;
  titulo: string;
  setTitulo: (t: string) => void;
  template: string;
  onTemplateChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}) {
  return (
    <div className="editor-header">
      <h1>Editor de CV</h1>
      <EditorHeaderRight
        cvId={cvId}
        titulo={titulo}
        setTitulo={setTitulo}
        template={template}
        onTemplateChange={onTemplateChange}
        onSave={onSave}
        isSaving={isSaving}
        canSave={canSave}
      />
    </div>
  );
}

function EditorHeaderRight({
  cvId,
  titulo,
  setTitulo,
  template,
  onTemplateChange,
  onSave,
  isSaving,
  canSave,
}: {
  cvId: string;
  titulo: string;
  setTitulo: (t: string) => void;
  template: string;
  onTemplateChange: (value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}) {
  const { showLoading } = useLoading();
  return (
    <div className="editor-header-right">
      <input
        type="text"
        className="cv-title-input"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Nombre de la hoja de vida"
        aria-label="Nombre de la hoja de vida"
      />
      <Link href="/mis-cv" className="btn btn-secondary">
        <Icon name="back" />
        Volver
      </Link>
      <TemplateSelector value={template} onChange={onTemplateChange} />
      <SaveButton onSave={onSave} isSaving={isSaving} canSave={canSave} />
      <Link
        href={`/cv/${cvId}/imprimir`}
        className="btn btn-secondary"
        onClick={() => showLoading("Preparando impresión…")}
      >
        <Icon name="print" />
        Imprimir
      </Link>
    </div>
  );
}

function SaveButton({
  onSave,
  isSaving,
  canSave,
}: {
  onSave: () => void;
  isSaving: boolean;
  canSave: boolean;
}) {
  return (
    <button
      className="btn btn-primary"
      onClick={onSave}
      disabled={isSaving || !canSave}
      aria-busy={isSaving}
      title={!canSave ? "El nombre debe tener al menos 2 caracteres" : undefined}
    >
      <Icon name="save" />
      {isSaving ? "Guardando…" : "Guardar"}
    </button>
  );
}

function TemplateSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="template-selector"
      aria-label="Seleccionar plantilla"
    >
      <option value="moderna">Moderna</option>
      <option value="clasica">Clásica</option>
      <option value="minimalista">Minimalista</option>
      <option value="corporativa">Corporativa</option>
    </select>
  );
}

export function EditorNavigation({
  sections,
  activeSection,
  onSectionChange,
}: {
  sections: { id: string; label: string }[];
  activeSection: string;
  onSectionChange: (id: string) => void;
}) {
  return (
    <nav className="section-tabs" role="tablist" aria-label="Secciones del CV">
      {sections.map((section) => (
        <button
          key={section.id}
          role="tab"
          aria-selected={activeSection === section.id}
          aria-controls={`panel-${section.id}`}
          id={`tab-${section.id}`}
          onClick={() => onSectionChange(section.id)}
          className={`section-tab ${activeSection === section.id ? "active" : ""}`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
