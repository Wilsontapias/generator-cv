import React from "react";
import Image from "next/image";
import type { CV } from "@/schemas/cv";
import { urlFoto } from "@/utils/foto";

interface TemplateProps {
  data: CV;
}

function MinimalistaPhoto({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  const src = urlFoto(fotoUrl);
  if (!src) return null;
  return (
    <div className="cv-photo">
      <Image src={src} alt={nombre} width={100} height={100} unoptimized />
    </div>
  );
}

function MinimalistaContact({ datos }: { datos: CV["datos"] }) {
  const items = [datos.email, datos.telefono, datos.ciudad, datos.linkedin].filter(Boolean);
  return (
    <div className="cv-contact">
      {items.map((item, i) => (
        <span key={i}>{item}</span>
      ))}
    </div>
  );
}

function MinimalistaProfile({ perfil }: { perfil: string }) {
  if (!perfil) return null;
  return (
    <section className="cv-section">
      <h2>Perfil</h2>
      <p>{perfil}</p>
    </section>
  );
}

function MinimalistaExperience({ experiencia }: { experiencia: CV["experiencia"] }) {
  if (experiencia.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Experiencia</h2>
      {experiencia.map((exp) => (
        <article key={exp.id} className="cv-entry">
          <div className="cv-entry-header">
            <h3>{exp.cargo}</h3>
            <span className="cv-entry-date">
              {exp.fechaInicio} — {exp.fechaFin}
            </span>
          </div>
          <p className="cv-entry-company">{exp.empresa}</p>
          {exp.descripcion && <p>{exp.descripcion}</p>}
        </article>
      ))}
    </section>
  );
}

function MinimalistaEducation({ estudios }: { estudios: CV["estudios"] }) {
  if (estudios.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Educación</h2>
      {estudios.map((est) => (
        <article key={est.id} className="cv-entry">
          <div className="cv-entry-header">
            <h3>{est.titulo}</h3>
            <span className="cv-entry-date">
              {est.fechaInicio} — {est.fechaFin}
            </span>
          </div>
          <p className="cv-entry-company">{est.institucion}</p>
          {est.descripcion && <p>{est.descripcion}</p>}
        </article>
      ))}
    </section>
  );
}

function MinimalistaSkills({ habilidades }: { habilidades: CV["habilidades"] }) {
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

function MinimalistaLanguages({ idiomas }: { idiomas: CV["idiomas"] }) {
  if (idiomas.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Idiomas</h2>
      <ul className="cv-languages">
        {idiomas.map((i) => (
          <li key={i.id}>
            {i.nombre} — {i.nivel}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PlantillaMinimalista({ data }: TemplateProps) {
  return (
    <div className="cv-template cv-minimalista">
      <div className="cv-header">
        <div className="cv-header-top">
          <div>
            <h1 className="cv-name">{data.datos.nombre}</h1>
            <p className="cv-title">{data.datos.cargo}</p>
          </div>
          <MinimalistaPhoto fotoUrl={data.datos.fotoUrl} nombre={data.datos.nombre} />
        </div>
        <MinimalistaContact datos={data.datos} />
      </div>
      <MinimalistaProfile perfil={data.perfil} />
      <MinimalistaExperience experiencia={data.experiencia} />
      <MinimalistaEducation estudios={data.estudios} />
      <MinimalistaSkills habilidades={data.habilidades} />
      <MinimalistaLanguages idiomas={data.idiomas} />
    </div>
  );
}
