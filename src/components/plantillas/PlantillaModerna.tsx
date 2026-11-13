import React from "react";
import Image from "next/image";
import type { CV } from "@/schemas/cv";
import { urlFoto } from "@/utils/foto";

interface TemplateProps {
  data: CV;
}

function ModernaPhoto({ fotoUrl, nombre }: { fotoUrl: string | null; nombre: string }) {
  const src = urlFoto(fotoUrl);
  if (src) {
    return (
      <div className="cv-photo">
        <Image src={src} alt={nombre} width={120} height={120} unoptimized />
      </div>
    );
  }
  return <div className="cv-photo-placeholder">{nombre.charAt(0)}</div>;
}

function ModernaContact({ datos }: { datos: CV["datos"] }) {
  return (
    <div className="cv-contact">
      {datos.email && <p>{datos.email}</p>}
      {datos.telefono && <p>{datos.telefono}</p>}
      {datos.ciudad && <p>{datos.ciudad}</p>}
      {datos.linkedin && <p>{datos.linkedin}</p>}
    </div>
  );
}

function ModernaSkills({ habilidades }: { habilidades: CV["habilidades"] }) {
  if (habilidades.length === 0) return null;
  return (
    <div className="cv-section">
      <h2>Habilidades</h2>
      <div className="cv-skills">
        {habilidades.map((h) => (
          <span key={h.id} className="cv-skill-tag">
            {h.nombre}
          </span>
        ))}
      </div>
    </div>
  );
}

function ModernaLanguages({ idiomas }: { idiomas: CV["idiomas"] }) {
  if (idiomas.length === 0) return null;
  return (
    <div className="cv-section">
      <h2>Idiomas</h2>
      <ul className="cv-languages">
        {idiomas.map((i) => (
          <li key={i.id}>
            {i.nombre} - {i.nivel}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModernaProfile({ perfil }: { perfil: string }) {
  if (!perfil) return null;
  return (
    <section className="cv-section">
      <h2>Perfil Profesional</h2>
      <p>{perfil}</p>
    </section>
  );
}

function ModernaExperience({ experiencia }: { experiencia: CV["experiencia"] }) {
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

function ModernaEducation({ estudios }: { estudios: CV["estudios"] }) {
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

export function PlantillaModerna({ data }: TemplateProps) {
  return (
    <div className="cv-template cv-moderna">
      <div className="cv-sidebar">
        <ModernaPhoto fotoUrl={data.datos.fotoUrl} nombre={data.datos.nombre} />
        <h1 className="cv-name">{data.datos.nombre}</h1>
        <p className="cv-title">{data.datos.cargo}</p>
        <ModernaContact datos={data.datos} />
        <ModernaSkills habilidades={data.habilidades} />
        <ModernaLanguages idiomas={data.idiomas} />
      </div>
      <div className="cv-main">
        <ModernaProfile perfil={data.perfil} />
        <ModernaExperience experiencia={data.experiencia} />
        <ModernaEducation estudios={data.estudios} />
      </div>
    </div>
  );
}
