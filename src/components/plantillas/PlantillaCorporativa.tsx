import React from "react";
import Image from "next/image";
import type { CV } from "@/schemas/cv";
import { formatearRangoFecha } from "@/utils/fecha";
import { urlFoto } from "@/utils/foto";

interface TemplateProps {
  data: CV;
}

function CorpPhoto({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  const src = urlFoto(fotoUrl);
  return (
    <div className="cv-photo">
      {src ? (
        <Image src={src} alt={nombre} width={84} height={84} unoptimized />
      ) : (
        <div className="cv-photo-placeholder">{nombre.charAt(0).toUpperCase()}</div>
      )}
    </div>
  );
}

function CorpContact({ datos }: { datos: CV["datos"] }) {
  const items = [datos.email, datos.telefono, datos.ciudad, datos.linkedin].filter(Boolean);
  return (
    <div className="cv-contact">
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}

function CorpProfile({ perfil }: { perfil: string }) {
  if (!perfil) return null;
  return (
    <section className="cv-section">
      <h2>Perfil Profesional</h2>
      <p>{perfil}</p>
    </section>
  );
}

function CorpExperience({ experiencia }: { experiencia: CV["experiencia"] }) {
  if (experiencia.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Experiencia Laboral</h2>
      {experiencia.map((exp) => (
        <article key={exp.id} className="cv-entry">
          <div className="cv-entry-header">
            <h3>{exp.cargo}</h3>
            <span className="cv-entry-date">
              {formatearRangoFecha(exp.fechaInicio, exp.fechaFin)}
            </span>
          </div>
          <p className="cv-entry-company">{exp.empresa}</p>
          {exp.descripcion && <p>{exp.descripcion}</p>}
        </article>
      ))}
    </section>
  );
}

function CorpEducation({ estudios }: { estudios: CV["estudios"] }) {
  if (estudios.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Educación</h2>
      {estudios.map((est) => (
        <article key={est.id} className="cv-entry">
          <div className="cv-entry-header">
            <h3>{est.titulo}</h3>
            <span className="cv-entry-date">
              {formatearRangoFecha(est.fechaInicio, est.fechaFin)}
            </span>
          </div>
          <p className="cv-entry-company">{est.institucion}</p>
          {est.descripcion && <p>{est.descripcion}</p>}
        </article>
      ))}
    </section>
  );
}

function CorpSkills({ habilidades }: { habilidades: CV["habilidades"] }) {
  if (habilidades.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Habilidades</h2>
      <div className="cv-skills">
        {habilidades.map((h) => (
          <span key={h.id} className="cv-skill-tag">
            {h.nombre}
          </span>
        ))}
      </div>
    </section>
  );
}

function CorpLanguages({ idiomas }: { idiomas: CV["idiomas"] }) {
  if (idiomas.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Idiomas</h2>
      <ul>
        {idiomas.map((i) => (
          <li key={i.id}>
            {i.nombre} - {i.nivel}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlantillaCorporativa({ data }: TemplateProps) {
  return (
    <div className="cv-template cv-corporativa">
      <header className="cv-corp-header">
        <CorpPhoto fotoUrl={data.datos.fotoUrl} nombre={data.datos.nombre} />
        <div className="cv-corp-header-info">
          <h1 className="cv-name">{data.datos.nombre || "Tu nombre"}</h1>
          <p className="cv-title">{data.datos.cargo || "Tu cargo profesional"}</p>
          <CorpContact datos={data.datos} />
        </div>
      </header>
      <CorpProfile perfil={data.perfil} />
      <CorpExperience experiencia={data.experiencia} />
      <CorpEducation estudios={data.estudios} />
      <CorpSkills habilidades={data.habilidades} />
      <CorpLanguages idiomas={data.idiomas} />
    </div>
  );
}
