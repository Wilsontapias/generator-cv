"use client";

import React from "react";
import { EditorHeader, EditorNavigation } from "@/components/editor/EditorLayout";
import { RenderEditorSection } from "@/components/editor/RenderSection";
import { CVPreview } from "@/components/plantillas/CVPreview";
import { Skeleton } from "@/components/ui/Skeleton";
import { Icon } from "@/components/ui/Icon";
import type { CV } from "@/schemas/cv";

interface EditorContentProps {
  cvId: string;
  titulo: string;
  setTitulo: (t: string) => void;
  template: string;
  setTemplate: (t: string) => void;
  isSaving: boolean;
  saveError: string;
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (s: string) => void;
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
  saveCV: (data: CV, tmpl: string) => Promise<void>;
}

export function EditorContent(props: EditorContentProps) {
  const [previewMaximized, togglePreviewMaximized] = useVistaPreviaMaximizada();
  return (
    <EditorContentLayout
      {...props}
      previewMaximized={previewMaximized}
      togglePreviewMaximized={togglePreviewMaximized}
    />
  );
}

interface EditorContentLayoutProps extends EditorContentProps {
  previewMaximized: boolean;
  togglePreviewMaximized: () => void;
}

function EditorContentLayout({
  cvId,
  titulo,
  setTitulo,
  template,
  setTemplate,
  isSaving,
  saveError,
  sections,
  activeSection,
  setActiveSection,
  cvData,
  setCvData,
  saveCV,
  previewMaximized,
  togglePreviewMaximized,
}: EditorContentLayoutProps) {
  return (
    <div className="editor-page">
      <EditorHeader
        cvId={cvId}
        titulo={titulo}
        setTitulo={setTitulo}
        template={template}
        onTemplateChange={setTemplate}
        onSave={() => void saveCV(cvData, template)}
        isSaving={isSaving}
        canSave={cvData.datos.nombre.trim().length >= 2}
      />
      {saveError && (
        <p className="save-error" role="alert">
          {saveError}
        </p>
      )}
      <EditorBody
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cvData={cvData}
        setCvData={setCvData}
        template={template}
        previewMaximized={previewMaximized}
        togglePreviewMaximized={togglePreviewMaximized}
        isSaving={isSaving}
      />
    </div>
  );
}

function EditorBody({
  sections,
  activeSection,
  setActiveSection,
  cvData,
  setCvData,
  template,
  previewMaximized,
  togglePreviewMaximized,
  isSaving,
}: {
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (s: string) => void;
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
  template: string;
  previewMaximized: boolean;
  togglePreviewMaximized: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="editor-layout">
      <EditorFormColumn
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cvData={cvData}
        setCvData={setCvData}
      />
      <EditorPreviewPanel
        template={template}
        cvData={cvData}
        maximized={previewMaximized}
        onToggleMaximize={togglePreviewMaximized}
        isSaving={isSaving}
      />
    </div>
  );
}

function useVistaPreviaMaximizada(): [boolean, () => void] {
  const [maximized, setMaximized] = React.useState(false);

  React.useEffect(() => {
    if (!maximized) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMaximized(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maximized]);

  const toggle = React.useCallback(() => setMaximized((v) => !v), []);
  return [maximized, toggle];
}

function EditorFormColumn({
  sections,
  activeSection,
  setActiveSection,
  cvData,
  setCvData,
}: {
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (s: string) => void;
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
}) {
  return (
    <div className="editor-form">
      <EditorNavigation
        sections={sections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="form-panels">
        <RenderEditorSection
          activeSection={activeSection}
          cvData={cvData}
          setCvData={setCvData}
          onPhotoChange={(url) => actualizarFoto(setCvData, url)}
        />
      </div>
    </div>
  );
}

function actualizarFoto(setCvData: (fn: (prev: CV) => CV) => void, url: string | null) {
  setCvData((prev) => ({ ...prev, datos: { ...prev.datos, fotoUrl: url } }));
}

function EditorPreviewPanel({
  template,
  cvData,
  maximized,
  onToggleMaximize,
  isSaving,
}: {
  template: string;
  cvData: CV;
  maximized: boolean;
  onToggleMaximize: () => void;
  isSaving: boolean;
}) {
  return (
    <div className={`editor-preview ${maximized ? "is-maximized" : ""}`}>
      <div className="preview-header">
        <h2>Vista Previa</h2>
        <div className="preview-header-actions">
          <span className="template-badge">{template}</span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onToggleMaximize}
            aria-label={maximized ? "Minimizar vista previa" : "Maximizar vista previa"}
            title={maximized ? "Minimizar" : "Maximizar"}
          >
            <Icon name={maximized ? "minimize" : "maximize"} />
            {maximized ? "Minimizar" : "Maximizar"}
          </button>
        </div>
      </div>
      <div className="preview-container">
        {isSaving && (
          <div className="preview-skeleton">
            <Skeleton width="100%" height="2rem" />
            <Skeleton width="60%" height="1rem" />
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="90%" height="1rem" />
            <Skeleton width="70%" height="1rem" />
          </div>
        )}
        <div className={isSaving ? "preview-content-saving" : ""}>
          <CVPreview data={cvData} template={template} />
        </div>
      </div>
    </div>
  );
}
