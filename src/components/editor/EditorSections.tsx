import React from "react";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import type { CV } from "@/schemas/cv";

interface PersonalSectionProps {
  cvData: CV;
  onPhotoChange: (url: string | null) => void;
}

export function PersonalSection({ cvData, onPhotoChange }: PersonalSectionProps) {
  return (
    <section id="panel-personal" role="tabpanel" aria-labelledby="tab-personal">
      <h2>Datos Personales</h2>
      <PhotoUpload currentPhotoUrl={cvData.datos.fotoUrl} onPhotoChange={onPhotoChange} />
      <PersonalFormFields cvData={cvData} />
    </section>
  );
}

function PersonalFormFields({ cvData }: { cvData: CV }) {
  const fields = [
    {
      id: "nombre",
      label: "Nombre completo",
      type: "text",
      placeholder: "Tu nombre completo",
      value: cvData.datos.nombre,
    },
    {
      id: "cargo",
      label: "Cargo o título profesional",
      type: "text",
      placeholder: "Ej: Desarrollador Full Stack",
      value: cvData.datos.cargo,
    },
    {
      id: "email",
      label: "Correo electrónico",
      type: "email",
      placeholder: "tu@email.com",
      value: cvData.datos.email,
    },
    {
      id: "telefono",
      label: "Teléfono",
      type: "tel",
      placeholder: "+57 300 123 4567",
      value: cvData.datos.telefono,
    },
    {
      id: "ciudad",
      label: "Ciudad",
      type: "text",
      placeholder: "Medellín, Colombia",
      value: cvData.datos.ciudad,
    },
  ];

  return (
    <>
      {fields.map((field) => (
        <FormField key={field.id} field={field} />
      ))}
    </>
  );
}

function FormField({
  field,
}: {
  field: { id: string; label: string; type: string; placeholder: string; value: string };
}) {
  return (
    <div className="form-group">
      <label htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        defaultValue={field.value}
      />
    </div>
  );
}

export function ProfileSection() {
  return (
    <section id="panel-perfil" role="tabpanel" aria-labelledby="tab-perfil">
      <h2>Perfil Profesional</h2>
      <div className="form-group">
        <label htmlFor="perfil">Resumen profesional</label>
        <textarea
          id="perfil"
          rows={5}
          placeholder="Describe tu perfil profesional en 3-4 líneas..."
        />
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section id="panel-experiencia" role="tabpanel" aria-labelledby="tab-experiencia">
      <h2>Experiencia Laboral</h2>
      <p className="section-hint">Máximo 10 experiencias</p>
      <button className="btn btn-secondary" type="button">
        + Agregar experiencia
      </button>
    </section>
  );
}

export function StudiesSection() {
  return (
    <section id="panel-estudios" role="tabpanel" aria-labelledby="tab-estudios">
      <h2>Estudios</h2>
      <p className="section-hint">Máximo 10 estudios</p>
      <button className="btn btn-secondary" type="button">
        + Agregar estudio
      </button>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section id="panel-habilidades" role="tabpanel" aria-labelledby="tab-habilidades">
      <h2>Habilidades</h2>
      <div className="form-group">
        <label htmlFor="habilidad">Agregar habilidad</label>
        <input id="habilidad" type="text" placeholder="Ej: React, TypeScript" />
      </div>
    </section>
  );
}

export function LanguagesSection() {
  return (
    <section id="panel-idiomas" role="tabpanel" aria-labelledby="tab-idiomas">
      <h2>Idiomas</h2>
      <div className="form-group">
        <label htmlFor="idioma">Agregar idioma</label>
        <input id="idioma" type="text" placeholder="Ej: Inglés" />
      </div>
    </section>
  );
}
