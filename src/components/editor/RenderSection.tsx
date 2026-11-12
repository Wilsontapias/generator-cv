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
  onPhotoChange: (url: string | null) => void;
}

export function RenderEditorSection({
  activeSection,
  cvData,
  onPhotoChange,
}: RenderEditorSectionProps) {
  const sectionMap: Record<string, React.ReactElement> = {
    personal: <PersonalSection cvData={cvData} onPhotoChange={onPhotoChange} />,
    perfil: <ProfileSection />,
    experiencia: <ExperienceSection />,
    estudios: <StudiesSection />,
    habilidades: <SkillsSection />,
    idiomas: <LanguagesSection />,
  };
  return sectionMap[activeSection] || null;
}
