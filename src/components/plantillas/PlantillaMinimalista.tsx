import React from "react";
import Image from "next/image";
import type { CV } from "@/schemas/cv";
import { formatearRangoFecha } from "@/utils/fecha";
import { urlFoto } from "@/utils/foto";

interface TemplateProps {
  data: CV;
}

function MinimalistaPhoto({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  const src = urlFoto(fotoUrl);
  return (
    <div className="cv-photo">
      {src ? (
        <Image src={src} alt={nombre} width={88} height={88} unoptimized />
      ) : (
        <div className="cv-photo-placeholder">{nombre.charAt(0).toUpperCase()}</div>
      )}
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
  return (
    <section className="cv-section">
      <h2>Perfil</h2>
      <p className="cv-profile">{perfil || "Describe tu perfil profesional en 3-4 líneas…"}</p>
    </section>
  );
}

function MinimalistaExperience({ experiencia }: { experiencia: CV["experiencia"] }) {
  if (experiencia.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Experiencia</h2>
      <div>
        {experiencia.map((exp) => (
          <article key={exp.id} className="cv-entry">
            <div className="cv-entry-header">
              <h3>{exp.cargo}</h3>
              <span className="cv-entry-date">
                {formatearRangoFecha(exp.fechaInicio, exp.fechaFin)}
              </span>
            </div>
            <p className="cv-entry-company">{exp.empresa}</p>
            {exp.descripcion && <p className="cv-entry-desc">{exp.descripcion}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function MinimalistaEducation({ estudios }: { estudios: CV["estudios"] }) {
  if (estudios.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Educación</h2>
      <div>
        {estudios.map((est) => (
          <article key={est.id} className="cv-entry">
            <div className="cv-entry-header">
              <h3>{est.titulo}</h3>
              <span className="cv-entry-date">
                {formatearRangoFecha(est.fechaInicio, est.fechaFin)}
              </span>
            </div>
            <p className="cv-entry-company">{est.institucion}</p>
            {est.descripcion && <p className="cv-entry-desc">{est.descripcion}</p>}
          </article>
        ))}
      </div>
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
            <strong>{i.nombre}</strong>
            <span className="cv-level">{i.nivel}</span>
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
            <h1 className="cv-name">{data.datos.nombre || "Tu nombre"}</h1>
            <p className="cv-title">{data.datos.cargo || "Tu cargo profesional"}</p>
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
