import React from "react";
import { EditorHeader, EditorNavigation } from "@/components/editor/EditorLayout";
import { RenderEditorSection } from "@/components/editor/RenderSection";
import { CVPreview } from "@/components/plantillas/CVPreview";
import { SavingIndicator } from "@/components/editor/EditorStates";
import type { CV } from "@/schemas/cv";

interface EditorContentProps {
  template: string;
  setTemplate: (t: string) => void;
  isSaving: boolean;
  sections: { id: string; label: string }[];
  activeSection: string;
  setActiveSection: (s: string) => void;
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
}

export function EditorContent({
  template,
  setTemplate,
  isSaving,
  sections,
  activeSection,
  setActiveSection,
  cvData,
  setCvData,
}: EditorContentProps) {
  return (
    <div className="editor-page">
      <EditorHeader template={template} onTemplateChange={setTemplate} />
      {isSaving && <SavingIndicator />}

      <div className="editor-layout">
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
              onPhotoChange={(url) =>
                setCvData((prev) => ({
                  ...prev,
                  datos: { ...prev.datos, fotoUrl: url },
                }))
              }
            />
          </div>
        </div>

        <EditorPreviewPanel template={template} cvData={cvData} />
      </div>
    </div>
  );
}

function EditorPreviewPanel({ template, cvData }: { template: string; cvData: CV }) {
  return (
    <div className="editor-preview">
      <div className="preview-header">
        <h2>Vista Previa</h2>
        <span className="template-badge">{template}</span>
      </div>
      <div className="preview-container">
        <CVPreview data={cvData} template={template} />
      </div>
    </div>
  );
}
