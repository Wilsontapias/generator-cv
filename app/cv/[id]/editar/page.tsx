"use client";

import React, { useState } from "react";
import "@/styles/editor.css";
import { EditorLoading, EditorError } from "@/components/editor/EditorStates";
import { EditorContent } from "@/components/editor/EditorContent";
import { useCVEditor } from "@/hooks/useCVEditor";
import { useParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

const sections = [
  { id: "personal", label: "Datos Personales" },
  { id: "perfil", label: "Perfil" },
  { id: "experiencia", label: "Experiencia" },
  { id: "estudios", label: "Estudios" },
  { id: "habilidades", label: "Habilidades" },
  { id: "idiomas", label: "Idiomas" },
];

export default function EditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const editor = useCVEditor(id);
  const { isLoading, saveCV, template, cvData, setCvData, setTemplate, error, isSaving } = editor;
  const [activeSection, setActiveSection] = useState("personal");
  const debouncedData = useDebounce(cvData, 1000);

  React.useEffect(() => {
    if (!isLoading && debouncedData) {
      saveCV(debouncedData, template);
    }
  }, [debouncedData, isLoading, saveCV, template]);

  if (isLoading) return <EditorLoading />;
  if (error) return <EditorError message={error} />;

  return (
    <EditorContent
      template={template}
      setTemplate={setTemplate}
      isSaving={isSaving}
      sections={sections}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      cvData={cvData}
      setCvData={setCvData}
    />
  );
}
