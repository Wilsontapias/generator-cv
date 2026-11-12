import React from "react";
import Image from "next/image";
import type { CV } from "@/schemas/cv";

interface TemplateProps {
  data: CV;
}

function ClasicaPhoto({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  if (!fotoUrl) return null;
  return (
    <div className="cv-photo">
      <Image src={fotoUrl} alt={nombre} width={80} height={80} />
    </div>
  );
}

function ClasicaContact({ datos }: { datos: CV["datos"] }) {
  const items = [datos.email, datos.telefono, datos.ciudad, datos.linkedin].filter(Boolean);
  return (
    <div className="cv-contact">
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}

function ClasicaProfile({ perfil }: { perfil: string }) {
  if (!perfil) return null;
  return (
    <section className="cv-section">
      <h2>Perfil Profesional</h2>
      <p>{perfil}</p>
    </section>
  );
}

function ClasicaExperience({ experiencia }: { experiencia: CV["experiencia"] }) {
  if (experiencia.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Experiencia Laboral</h2>
      {experiencia.map((exp) => (
        <article key={exp.id} className="cv-entry">
          <div className="cv-entry-header">
            <h3>{exp.cargo}</h3>
            <span className="cv-entry-date">
              {exp.fechaInicio} - {exp.fechaFin}
            </span>
          </div>
          <p className="cv-entry-company">{exp.empresa}</p>
          {exp.descripcion && <p>{exp.descripcion}</p>}
        </article>
      ))}
    </section>
  );
}

function ClasicaEducation({ estudios }: { estudios: CV["estudios"] }) {
  if (estudios.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Educación</h2>
      {estudios.map((est) => (
        <article key={est.id} className="cv-entry">
          <div className="cv-entry-header">
            <h3>{est.titulo}</h3>
            <span className="cv-entry-date">
              {est.fechaInicio} - {est.fechaFin}
            </span>
          </div>
          <p className="cv-entry-company">{est.institucion}</p>
          {est.descripcion && <p>{est.descripcion}</p>}
        </article>
      ))}
    </section>
  );
}

function ClasicaSkills({ habilidades }: { habilidades: CV["habilidades"] }) {
  if (habilidades.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Habilidades</h2>
      <p className="cv-skills-list">{habilidades.map((h) => h.nombre).join(", ")}</p>
    </section>
  );
}

function ClasicaLanguages({ idiomas }: { idiomas: CV["idiomas"] }) {
  if (idiomas.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Idiomas</h2>
      <p className="cv-languages-list">
        {idiomas.map((i) => `${i.nombre} (${i.nivel})`).join(", ")}
      </p>
    </section>
  );
}

export function PlantillaClasica({ data }: TemplateProps) {
  return (
    <div className="cv-template cv-clasica">
      <div className="cv-header">
        <ClasicaPhoto fotoUrl={data.datos.fotoUrl} nombre={data.datos.nombre} />
        <h1 className="cv-name">{data.datos.nombre}</h1>
        <p className="cv-title">{data.datos.cargo}</p>
        <ClasicaContact datos={data.datos} />
      </div>
      <ClasicaProfile perfil={data.perfil} />
      <ClasicaExperience experiencia={data.experiencia} />
      <ClasicaEducation estudios={data.estudios} />
      <ClasicaSkills habilidades={data.habilidades} />
      <ClasicaLanguages idiomas={data.idiomas} />
    </div>
  );
}
