"use client";

import React from "react";
import Link from "next/link";

export function EditorHeader({
  template,
  onTemplateChange,
}: {
  template: string;
  onTemplateChange: (value: string) => void;
}) {
  return (
    <div className="editor-header">
      <Link href="/mis-cv" className="btn btn-secondary">
        ← Volver
      </Link>
      <h1>Editor de CV</h1>
      <div className="editor-actions">
        <select
          value={template}
          onChange={(e) => onTemplateChange(e.target.value)}
          className="template-selector"
          aria-label="Seleccionar plantilla"
        >
          <option value="moderna">Moderna</option>
          <option value="clasica">Clásica</option>
          <option value="minimalista">Minimalista</option>
        </select>
        <button className="btn btn-primary">Guardar</button>
        <Link href="/cv/1/imprimir" className="btn btn-secondary">
          Imprimir
        </Link>
      </div>
    </div>
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

export function EditorPreview({ template }: { template: string }) {
  return (
    <div className="editor-preview">
      <div className="preview-header">
        <h2>Vista Previa</h2>
        <span className="template-badge">{template}</span>
      </div>
      <div className="preview-container">
        <div className="cv-preview">
          <p>Vista previa del CV con plantilla {template}</p>
          <p className="preview-hint">
            La vista previa se actualizará en tiempo real conforme edites tu CV.
          </p>
        </div>
      </div>
    </div>
  );
}
