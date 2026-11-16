import React from "react";
import {
  PersonalSection,
  ProfileSection,
  ExperienceSection,
  StudiesSection,
  SkillsSection,
  LanguagesSection,
} from "@/components/editor/EditorSections";
import type { CV } from "@/schemas/cv";

interface RenderEditorSectionProps {
  activeSection: string;
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
  onPhotoChange: (url: string | null) => void;
}

export function RenderEditorSection({
  activeSection,
  cvData,
  setCvData,
  onPhotoChange,
}: RenderEditorSectionProps) {
  // Se renderizan todas las secciones y se ocultan las inactivas con `hidden`
  // para conservar el estado local (borradores) al cambiar de pestaña.
  const items = [
    {
      key: "personal",
      node: <PersonalSection cvData={cvData} setCvData={setCvData} onPhotoChange={onPhotoChange} />,
    },
    { key: "perfil", node: <ProfileSection cvData={cvData} setCvData={setCvData} /> },
    { key: "experiencia", node: <ExperienceSection cvData={cvData} setCvData={setCvData} /> },
    { key: "estudios", node: <StudiesSection cvData={cvData} setCvData={setCvData} /> },
    { key: "habilidades", node: <SkillsSection cvData={cvData} setCvData={setCvData} /> },
    { key: "idiomas", node: <LanguagesSection cvData={cvData} setCvData={setCvData} /> },
  ];

  return (
    <>
      {items.map((item) => (
        <div key={item.key} hidden={activeSection !== item.key}>
          {item.node}
        </div>
      ))}
    </>
  );
}
