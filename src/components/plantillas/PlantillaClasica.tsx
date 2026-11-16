import React from "react";
import Image from "next/image";
import type { CV } from "@/schemas/cv";
import { formatearRangoFecha } from "@/utils/fecha";
import { urlFoto } from "@/utils/foto";

interface TemplateProps {
  data: CV;
}

function ClasicaPhoto({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  const src = urlFoto(fotoUrl);
  return (
    <div className="cv-photo">
      {src ? (
        <Image src={src} alt={nombre} width={96} height={96} unoptimized />
      ) : (
        <div className="cv-photo-placeholder">{nombre.charAt(0).toUpperCase()}</div>
      )}
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
  return (
    <section className="cv-section">
      <h2>Perfil Profesional</h2>
      <p className="cv-profile">{perfil || "Describe tu perfil profesional en 3-4 líneas…"}</p>
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
          <span className="cv-entry-date">
            {formatearRangoFecha(exp.fechaInicio, exp.fechaFin)}
          </span>
          <div className="cv-entry-body">
            <h3>{exp.cargo}</h3>
            <p className="cv-entry-company">{exp.empresa}</p>
            {exp.descripcion && <p className="cv-entry-desc">{exp.descripcion}</p>}
          </div>
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
          <span className="cv-entry-date">
            {formatearRangoFecha(est.fechaInicio, est.fechaFin)}
          </span>
          <div className="cv-entry-body">
            <h3>{est.titulo}</h3>
            <p className="cv-entry-company">{est.institucion}</p>
            {est.descripcion && <p className="cv-entry-desc">{est.descripcion}</p>}
          </div>
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
      <ul className="cv-skills-list">
        {habilidades.map((h) => (
          <li key={h.id}>{h.nombre}</li>
        ))}
      </ul>
    </section>
  );
}

function ClasicaLanguages({ idiomas }: { idiomas: CV["idiomas"] }) {
  if (idiomas.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Idiomas</h2>
      <ul className="cv-languages-list">
        {idiomas.map((i) => (
          <li key={i.id}>
            {i.nombre} <span className="cv-level">({i.nivel})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlantillaClasica({ data }: TemplateProps) {
  const tieneHabilidades = data.habilidades.length > 0;
  const tieneIdiomas = data.idiomas.length > 0;
  return (
    <div className="cv-template cv-clasica">
      <div className="cv-header">
        <div className="cv-header-info">
          <h1 className="cv-name">{data.datos.nombre || "Tu nombre"}</h1>
          <p className="cv-title">{data.datos.cargo || "Tu cargo profesional"}</p>
          <ClasicaContact datos={data.datos} />
        </div>
        <ClasicaPhoto fotoUrl={data.datos.fotoUrl} nombre={data.datos.nombre} />
      </div>
      <ClasicaProfile perfil={data.perfil} />
      <ClasicaExperience experiencia={data.experiencia} />
      <ClasicaEducation estudios={data.estudios} />
      {tieneHabilidades || tieneIdiomas ? (
        <div className="cv-columns">
          <ClasicaSkills habilidades={data.habilidades} />
          <ClasicaLanguages idiomas={data.idiomas} />
        </div>
      ) : null}
    </div>
  );
}
