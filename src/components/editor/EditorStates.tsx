import React from "react";

export function EditorLoading() {
  return (
    <div className="editor-page">
      <p>Cargando editor...</p>
    </div>
  );
}

export function EditorError({ message }: { message: string }) {
  return (
    <div className="editor-page">
      <p className="error-message">{message}</p>
    </div>
  );
}

export function SavingIndicator() {
  return (
    <div className="saving-indicator" aria-live="polite">
      Guardando...
    </div>
  );
}

export function EditorPreviewPanel({ template }: { template: string }) {
  return (
    <div className="editor-preview">
      <div className="preview-header">
        <h2>Vista Previa</h2>
        <span className="template-badge">{template}</span>
      </div>
      <div className="preview-container">
        <p>Vista previa con plantilla {template}</p>
      </div>
    </div>
  );
}
