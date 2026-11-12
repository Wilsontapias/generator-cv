import React from "react";
import Link from "next/link";

export function PublicBanner() {
  return (
    <div className="public-banner">
      <p>
        Este es un CV compartido públicamente.{" "}
        <Link href="/" className="banner-link">
          Crea tu propio CV gratis
        </Link>
      </p>
    </div>
  );
}

export function NotFoundState({ message }: { message: string }) {
  return (
    <div className="public-page">
      <div className="not-found-container">
        <h1>404 - CV no encontrado</h1>
        <p>{message}</p>
        <Link href="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="public-page">
      <p>Cargando CV...</p>
    </div>
  );
}

export function CVHeader({
  cv,
}: {
  cv: {
    datos: {
      nombre: string;
      cargo: string;
      email: string;
      telefono: string;
      ciudad: string;
      linkedin: string;
    };
  };
}) {
  return (
    <div className="cv-header">
      <h1>{cv.datos.nombre}</h1>
      <p className="cv-title">{cv.datos.cargo}</p>
      <div className="cv-contact">
        {cv.datos.email && <span>{cv.datos.email}</span>}
        {cv.datos.telefono && <span>{cv.datos.telefono}</span>}
        {cv.datos.ciudad && <span>{cv.datos.ciudad}</span>}
        {cv.datos.linkedin && <span>{cv.datos.linkedin}</span>}
      </div>
    </div>
  );
}

export function CVProfile({ perfil }: { perfil: string }) {
  if (!perfil) return null;
  return (
    <section className="cv-section">
      <h2>Perfil Profesional</h2>
      <p>{perfil}</p>
    </section>
  );
}

export function CVExperience({
  experiencia,
}: {
  experiencia: Array<{
    id: string;
    cargo: string;
    empresa: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
  }>;
}) {
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

export function CVEducation({
  estudios,
}: {
  estudios: Array<{
    id: string;
    titulo: string;
    institucion: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
  }>;
}) {
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

export function CVSkills({
  habilidades,
}: {
  habilidades: Array<{ id: string; nombre: string; nivel: string }>;
}) {
  if (habilidades.length === 0) return null;
  return (
    <section className="cv-section">
      <h2>Habilidades</h2>
      <div className="cv-skills">
        {habilidades.map((h) => (
          <span key={h.id}>{h.nombre}</span>
        ))}
      </div>
    </section>
  );
}

export function CVLanguages({
  idiomas,
}: {
  idiomas: Array<{ id: string; nombre: string; nivel: string }>;
}) {
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
