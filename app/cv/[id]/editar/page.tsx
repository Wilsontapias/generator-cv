"use client";

import React, { useState } from "react";
import "@/styles/editor.css";
import { EditorError } from "@/components/editor/EditorStates";
import { EditorContent } from "@/components/editor/EditorContent";
import { useCVEditor } from "@/hooks/useCVEditor";
import { useParams } from "next/navigation";
import { useLoading } from "@/hooks/useLoading";
import type { CV } from "@/schemas/cv";

const sections = [
  { id: "personal", label: "Datos Personales" },
  { id: "perfil", label: "Perfil" },
  { id: "experiencia", label: "Experiencia" },
  { id: "estudios", label: "Estudios" },
  { id: "habilidades", label: "Habilidades" },
  { id: "idiomas", label: "Idiomas" },
];

function useGuardadoSeguridad(
  cvData: CV,
  template: string,
  saveCV: (data: CV, tpl: string) => Promise<void>
) {
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && cvData.datos.nombre.trim().length >= 2) {
        void saveCV(cvData, template);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [cvData, template, saveCV]);
}

export default function EditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const editor = useCVEditor(id);
  const {
    isLoading,
    saveCV,
    template,
    cvData,
    setCvData,
    setTemplate,
    error,
    saveError,
    isSaving,
    titulo,
    setTitulo,
  } = editor;
  const [activeSection, setActiveSection] = useState("personal");
  const { showLoading, hideLoading } = useLoading();

  useGuardadoSeguridad(cvData, template, saveCV);

  React.useEffect(() => {
    if (isLoading) showLoading("Cargando editor…");
    else hideLoading();
  }, [isLoading, showLoading, hideLoading]);

  if (isLoading) return null;
  if (error) {
    hideLoading();
    return <EditorError message={error} />;
  }

  return (
    <EditorContent
      cvId={id}
      titulo={titulo}
      setTitulo={setTitulo}
      template={template}
      setTemplate={setTemplate}
      isSaving={isSaving}
      saveError={saveError}
      sections={sections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      cvData={cvData}
      setCvData={setCvData}
      saveCV={saveCV}
    />
  );
}
