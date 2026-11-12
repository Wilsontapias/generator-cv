"use client";

import React from "react";
import "@/styles/public.css";
import { useParams } from "next/navigation";
import {
  PublicBanner,
  NotFoundState,
  LoadingState,
  CVHeader,
  CVProfile,
  CVExperience,
  CVEducation,
  CVSkills,
  CVLanguages,
} from "@/components/public/PublicCVContent";
import { usePublicCV } from "@/hooks/usePublicCV";

export default function PublicCVPage() {
  const params = useParams();
  const codigo = params?.codigo as string;
  const { cv, isLoading, error } = usePublicCV(codigo);

  if (isLoading) return <LoadingState />;
  if (error || !cv) {
    return (
      <NotFoundState
        message={error || "El CV que buscas no existe o no está disponible públicamente."}
      />
    );
  }

  return (
    <div className="public-page">
      <PublicBanner />
      <div className="cv-public">
        <CVHeader cv={cv} />
        <CVProfile perfil={cv.perfil} />
        <CVExperience experiencia={cv.experiencia} />
        <CVEducation estudios={cv.estudios} />
        <CVSkills habilidades={cv.habilidades} />
        <CVLanguages idiomas={cv.idiomas} />
      </div>
    </div>
  );
}
