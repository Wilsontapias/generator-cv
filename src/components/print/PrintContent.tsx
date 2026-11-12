import React from "react";

export function PrintControls() {
  return (
    <div className="print-controls noprint">
      <h2>Imprimir CV</h2>
      <div className="print-options">
        <label>
          <input type="checkbox" defaultChecked />
          Mostrar foto
        </label>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Imprimir / Descargar PDF
        </button>
      </div>
    </div>
  );
}

export function CVHeader() {
  return (
    <div className="cv-header">
      <h1>Wilson Tapias Posada</h1>
      <p className="cv-title">Desarrollador Full Stack</p>
      <div className="cv-contact">
        <span>wilson@example.com</span>
        <span>•</span>
        <span>+57 300 123 4567</span>
        <span>•</span>
        <span>Medellín, Colombia</span>
      </div>
    </div>
  );
}

export function CVProfile() {
  return (
    <section className="cv-section">
      <h2>Perfil Profesional</h2>
      <p>
        Desarrollador con experiencia en React, Node.js y TypeScript. Apasionado por crear
        interfaces accesibles y performantes.
      </p>
    </section>
  );
}

export function CVExperience() {
  return (
    <section className="cv-section">
      <h2>Experiencia Laboral</h2>
      <article className="cv-entry">
        <div className="cv-entry-header">
          <h3>Desarrollador Frontend</h3>
          <span className="cv-entry-date">Ene 2023 - Actual</span>
        </div>
        <p className="cv-entry-company">Empresa ABC</p>
        <ul>
          <li>Desarrollo de interfaces web con React y TypeScript</li>
          <li>Implementación de pruebas unitarias con Vitest</li>
          <li>Optimización de rendimiento y accesibilidad</li>
        </ul>
      </article>
    </section>
  );
}

export function CVEducation() {
  return (
    <section className="cv-section">
      <h2>Educación</h2>
      <article className="cv-entry">
        <div className="cv-entry-header">
          <h3>Ingeniería de Sistemas</h3>
          <span className="cv-entry-date">2019 - 2023</span>
        </div>
        <p className="cv-entry-company">Universidad Nacional</p>
      </article>
    </section>
  );
}

export function CVSkills() {
  return (
    <section className="cv-section">
      <h2>Habilidades</h2>
      <div className="cv-skills">
        <span>React</span>
        <span>TypeScript</span>
        <span>Node.js</span>
        <span>PostgreSQL</span>
        <span>Git</span>
        <span>Docker</span>
      </div>
    </section>
  );
}

export function CVLanguages() {
  return (
    <section className="cv-section">
      <h2>Idiomas</h2>
      <ul>
        <li>Español - Nativo</li>
        <li>Inglés - Avanzado (C1)</li>
      </ul>
    </section>
  );
}

export function CVPrintContent() {
  return (
    <div className="cv-print">
      <CVHeader />
      <CVProfile />
      <CVExperience />
      <CVEducation />
      <CVSkills />
      <CVLanguages />
    </div>
  );
}
