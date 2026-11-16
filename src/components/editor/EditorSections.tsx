"use client";

import React from "react";
import { toast } from "sonner";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import type { CV } from "@/schemas/cv";

const ESTADO_EXPERIENCIA_INICIAL = {
  cargo: "",
  empresa: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
};
const ESTADO_ESTUDIOS_INICIAL = {
  titulo: "",
  institucion: "",
  fechaInicio: "",
  fechaFin: "",
  descripcion: "",
};

function moverExperiencia(
  setCvData: ((fn: (prev: CV) => CV) => void) | undefined,
  id: string,
  direccion: "arriba" | "abajo"
) {
  setCvData?.((prev) => {
    const idx = prev.experiencia.findIndex((e) => e.id === id);
    if (idx < 0) return prev;
    const nuevoIdx = direccion === "arriba" ? idx - 1 : idx + 1;
    if (nuevoIdx < 0 || nuevoIdx >= prev.experiencia.length) return prev;
    const arr = [...prev.experiencia];
    const [removed] = arr.splice(idx, 1);
    if (removed) arr.splice(nuevoIdx, 0, removed);
    return { ...prev, experiencia: arr };
  });
}

function moverEstudio(
  setCvData: ((fn: (prev: CV) => CV) => void) | undefined,
  id: string,
  direccion: "arriba" | "abajo"
) {
  setCvData?.((prev) => {
    const idx = prev.estudios.findIndex((e) => e.id === id);
    if (idx < 0) return prev;
    const nuevoIdx = direccion === "arriba" ? idx - 1 : idx + 1;
    if (nuevoIdx < 0 || nuevoIdx >= prev.estudios.length) return prev;
    const arr = [...prev.estudios];
    const [removed] = arr.splice(idx, 1);
    if (removed) arr.splice(nuevoIdx, 0, removed);
    return { ...prev, estudios: arr };
  });
}

interface PersonalSectionProps {
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
  onPhotoChange: (url: string | null) => void;
}

export function PersonalSection({ cvData, setCvData, onPhotoChange }: PersonalSectionProps) {
  return (
    <section id="panel-personal" role="tabpanel" aria-labelledby="tab-personal">
      <h2>Datos Personales</h2>
      <PhotoUpload currentPhotoUrl={cvData.datos.fotoUrl} onPhotoChange={onPhotoChange} />
      <PersonalFormFields cvData={cvData} setCvData={setCvData} />
    </section>
  );
}

function PersonalFormFields({
  cvData,
  setCvData,
}: {
  cvData: CV;
  setCvData: (fn: (prev: CV) => CV) => void;
}) {
  const fields = camposPersonales(cvData);
  return (
    <div className="form-grid-2">
      {fields.map((field) => (
        <FormField key={field.id} field={field} setCvData={setCvData} />
      ))}
    </div>
  );
}

function camposPersonales(cvData: CV) {
  return [
    {
      id: "nombre",
      label: "Nombre completo",
      type: "text",
      placeholder: "Tu nombre completo",
      value: cvData.datos.nombre,
      marginTop: "var(--spacing-sm)",
    },
    {
      id: "cargo",
      label: "Cargo o título profesional",
      type: "text",
      placeholder: "Ej: Desarrollador Full Stack",
      value: cvData.datos.cargo,
      marginTop: "var(--spacing-sm)",
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
      marginTop: "calc(-1 * var(--spacing-xs))",
    },
    {
      id: "ciudad",
      label: "Ciudad",
      type: "text",
      placeholder: "Medellín, Colombia",
      value: cvData.datos.ciudad,
      marginTop: "calc(-1 * var(--spacing-xs))",
    },
  ];
}

function FormField({
  field,
  setCvData,
}: {
  field: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    marginTop?: string;
  };
  setCvData: (fn: (prev: CV) => CV) => void;
}) {
  return (
    <div
      className="form-group"
      style={field.marginTop ? { marginTop: field.marginTop } : undefined}
    >
      <label htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value}
        onChange={(e) => {
          const nuevo = e.target.value;
          setCvData((prev) => ({ ...prev, datos: { ...prev.datos, [field.id]: nuevo } }));
        }}
      />
    </div>
  );
}

export function ProfileSection({
  cvData,
  setCvData,
}: {
  cvData?: CV;
  setCvData?: (fn: (prev: CV) => CV) => void;
}) {
  const perfil = cvData?.perfil ?? "";
  return (
    <section id="panel-perfil" role="tabpanel" aria-labelledby="tab-perfil">
      <h2>Perfil Profesional</h2>
      <div className="form-group">
        <label htmlFor="perfil">Resumen profesional</label>
        <textarea
          id="perfil"
          rows={5}
          placeholder="Describe tu perfil profesional en 3-4 líneas..."
          value={perfil}
          onChange={(e) => {
            const nuevo = e.target.value;
            setCvData?.((prev) => ({ ...prev, perfil: nuevo }));
          }}
        />
      </div>
    </section>
  );
}

export function ExperienceSection({
  cvData,
  setCvData,
}: {
  cvData?: CV;
  setCvData?: (fn: (prev: CV) => CV) => void;
}) {
  const draft = useExperienciaDraft(setCvData);
  const experiencia = cvData?.experiencia ?? [];
  return (
    <section id="panel-experiencia" role="tabpanel" aria-labelledby="tab-experiencia">
      <h2>Experiencia Laboral</h2>
      <p className="section-hint">Máximo 10 experiencias</p>
      <CamposExperiencia draft={draft} />
      <button type="button" className="btn btn-secondary" onClick={draft.agregar}>
        + Agregar experiencia
      </button>
      <ListaExperiencia experiencia={experiencia} onQuitar={draft.quitar} onMover={draft.mover} />
    </section>
  );
}

function useExperienciaDraft(setCvData?: (fn: (prev: CV) => CV) => void) {
  const [d, setD] = React.useState(ESTADO_EXPERIENCIA_INICIAL);
  const agregar = React.useCallback(() => {
    if (!d.cargo.trim() || !d.empresa.trim() || !d.fechaInicio || !setCvData) return;
    if (d.fechaFin && d.fechaFin !== "actual" && d.fechaInicio > d.fechaFin) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    setCvData((prev) => ({
      ...prev,
      experiencia: [
        ...prev.experiencia,
        {
          id: crypto.randomUUID(),
          cargo: d.cargo.trim(),
          empresa: d.empresa.trim(),
          fechaInicio: d.fechaInicio,
          fechaFin: d.fechaFin || "actual",
          descripcion: d.descripcion.trim(),
        },
      ],
    }));
    setD({ cargo: "", empresa: "", fechaInicio: "", fechaFin: "", descripcion: "" });
  }, [d, setCvData]);
  const quitar = React.useCallback(
    (id: string) =>
      setCvData?.((prev) => ({
        ...prev,
        experiencia: prev.experiencia.filter((e) => e.id !== id),
      })),
    [setCvData]
  );
  const mover = (id: string, direccion: "arriba" | "abajo") =>
    moverExperiencia(setCvData, id, direccion);
  return {
    cargo: d.cargo,
    setCargo: (v: string) => setD((x) => ({ ...x, cargo: v })),
    empresa: d.empresa,
    setEmpresa: (v: string) => setD((x) => ({ ...x, empresa: v })),
    fechaInicio: d.fechaInicio,
    setFechaInicio: (v: string) => setD((x) => ({ ...x, fechaInicio: v })),
    fechaFin: d.fechaFin,
    setFechaFin: (v: string) => setD((x) => ({ ...x, fechaFin: v })),
    descripcion: d.descripcion,
    setDescripcion: (v: string) => setD((x) => ({ ...x, descripcion: v })),
    agregar,
    quitar,
    mover,
  };
}

function CamposExperiencia({ draft }: { draft: ReturnType<typeof useExperienciaDraft> }) {
  return (
    <>
      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="exp-cargo">Cargo</label>
          <input
            id="exp-cargo"
            type="text"
            value={draft.cargo}
            onChange={(e) => draft.setCargo(e.target.value)}
            placeholder="Ej: Desarrollador Full Stack"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exp-empresa">Empresa</label>
          <input
            id="exp-empresa"
            type="text"
            value={draft.empresa}
            onChange={(e) => draft.setEmpresa(e.target.value)}
            placeholder="Ej: ACME"
          />
        </div>
      </div>
      <FechasExperiencia draft={draft} />
      <div className="form-group">
        <label htmlFor="exp-desc">Descripción</label>
        <textarea
          id="exp-desc"
          rows={3}
          value={draft.descripcion}
          onChange={(e) => draft.setDescripcion(e.target.value)}
          placeholder="Descripción de la experiencia"
        />
      </div>
    </>
  );
}

function FechasExperiencia({ draft }: { draft: ReturnType<typeof useExperienciaDraft> }) {
  return (
    <div className="form-group-inline">
      <div className="form-group">
        <label htmlFor="exp-inicio">Fecha inicio</label>
        <input
          id="exp-inicio"
          type="month"
          value={draft.fechaInicio}
          onChange={(e) => draft.setFechaInicio(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="exp-fin">Fecha fin</label>
        <input
          id="exp-fin"
          type="month"
          value={draft.fechaFin}
          onChange={(e) => draft.setFechaFin(e.target.value)}
        />
      </div>
    </div>
  );
}

function BotonesFila({
  id,
  etiqueta,
  index,
  total,
  onMover,
  onQuitar,
}: {
  id: string;
  etiqueta: string;
  index: number;
  total: number;
  onMover: (id: string, direccion: "arriba" | "abajo") => void;
  onQuitar: (id: string) => void;
}) {
  return (
    <span className="fila-acciones">
      <button
        type="button"
        className="skill-remove"
        onClick={() => onMover(id, "arriba")}
        disabled={index === 0}
        aria-label={`Subir ${etiqueta}`}
      >
        ↑
      </button>
      <button
        type="button"
        className="skill-remove"
        onClick={() => onMover(id, "abajo")}
        disabled={index === total - 1}
        aria-label={`Bajar ${etiqueta}`}
      >
        ↓
      </button>
      <button
        type="button"
        className="skill-remove"
        onClick={() => onQuitar(id)}
        aria-label={`Quitar ${etiqueta}`}
      >
        ×
      </button>
    </span>
  );
}

function FilaExperiencia({
  exp,
  index,
  total,
  onQuitar,
  onMover,
}: {
  exp: CV["experiencia"][number];
  index: number;
  total: number;
  onQuitar: (id: string) => void;
  onMover: (id: string, direccion: "arriba" | "abajo") => void;
}) {
  return (
    <tr key={exp.id}>
      <td>{exp.cargo}</td>
      <td>{exp.empresa}</td>
      <td>
        {exp.fechaInicio} - {exp.fechaFin}
      </td>
      <td>{exp.descripcion || "—"}</td>
      <td>
        <BotonesFila
          id={exp.id}
          etiqueta={exp.cargo}
          index={index}
          total={total}
          onMover={onMover}
          onQuitar={onQuitar}
        />
      </td>
    </tr>
  );
}

function ListaExperiencia({
  experiencia,
  onQuitar,
  onMover,
}: {
  experiencia: CV["experiencia"];
  onQuitar: (id: string) => void;
  onMover: (id: string, direccion: "arriba" | "abajo") => void;
}) {
  if (experiencia.length === 0) return null;
  return (
    <div className="editor-table-wrap" style={{ marginTop: "var(--spacing-md)" }}>
      <table className="editor-table">
        <caption className="sr-only">Experiencias agregadas</caption>
        <thead>
          <tr>
            <th scope="col">Cargo</th>
            <th scope="col">Empresa</th>
            <th scope="col">Fechas</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {experiencia.map((exp, index) => (
            <FilaExperiencia
              key={exp.id}
              exp={exp}
              index={index}
              total={experiencia.length}
              onQuitar={onQuitar}
              onMover={onMover}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StudiesSection({
  cvData,
  setCvData,
}: {
  cvData?: CV;
  setCvData?: (fn: (prev: CV) => CV) => void;
}) {
  const draft = useEstudiosDraft(setCvData);
  const estudios = cvData?.estudios ?? [];
  return (
    <section id="panel-estudios" role="tabpanel" aria-labelledby="tab-estudios">
      <h2>Estudios</h2>
      <p className="section-hint">Máximo 10 estudios</p>
      <CamposEstudios draft={draft} />
      <button type="button" className="btn btn-secondary" onClick={draft.agregar}>
        + Agregar estudio
      </button>
      <ListaEstudios estudios={estudios} onQuitar={draft.quitar} onMover={draft.mover} />
    </section>
  );
}

function useEstudiosDraft(setCvData?: (fn: (prev: CV) => CV) => void) {
  const [d, setD] = React.useState(ESTADO_ESTUDIOS_INICIAL);
  const agregar = React.useCallback(() => {
    if (!d.titulo.trim() || !d.institucion.trim() || !d.fechaInicio || !setCvData) return;
    if (d.fechaFin && d.fechaInicio > d.fechaFin) {
      toast.error("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }
    setCvData((prev) => ({
      ...prev,
      estudios: [
        ...prev.estudios,
        {
          id: crypto.randomUUID(),
          titulo: d.titulo.trim(),
          institucion: d.institucion.trim(),
          fechaInicio: d.fechaInicio,
          fechaFin: d.fechaFin,
          descripcion: d.descripcion.trim(),
        },
      ],
    }));
    setD({ titulo: "", institucion: "", fechaInicio: "", fechaFin: "", descripcion: "" });
  }, [d, setCvData]);
  const quitar = React.useCallback(
    (id: string) =>
      setCvData?.((prev) => ({ ...prev, estudios: prev.estudios.filter((e) => e.id !== id) })),
    [setCvData]
  );
  const mover = (id: string, direccion: "arriba" | "abajo") =>
    moverEstudio(setCvData, id, direccion);
  return {
    titulo: d.titulo,
    setTitulo: (v: string) => setD((x) => ({ ...x, titulo: v })),
    institucion: d.institucion,
    setInstitucion: (v: string) => setD((x) => ({ ...x, institucion: v })),
    fechaInicio: d.fechaInicio,
    setFechaInicio: (v: string) => setD((x) => ({ ...x, fechaInicio: v })),
    fechaFin: d.fechaFin,
    setFechaFin: (v: string) => setD((x) => ({ ...x, fechaFin: v })),
    descripcion: d.descripcion,
    setDescripcion: (v: string) => setD((x) => ({ ...x, descripcion: v })),
    agregar,
    quitar,
    mover,
  };
}

function CamposEstudios({ draft }: { draft: ReturnType<typeof useEstudiosDraft> }) {
  return (
    <>
      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="est-titulo">Título</label>
          <input
            id="est-titulo"
            type="text"
            value={draft.titulo}
            onChange={(e) => draft.setTitulo(e.target.value)}
            placeholder="Ej: Ingeniería de Sistemas"
          />
        </div>
        <div className="form-group">
          <label htmlFor="est-inst">Institución</label>
          <input
            id="est-inst"
            type="text"
            value={draft.institucion}
            onChange={(e) => draft.setInstitucion(e.target.value)}
            placeholder="Ej: Universidad X"
          />
        </div>
      </div>
      <FechasEstudios draft={draft} />
      <div className="form-group">
        <label htmlFor="est-desc">Descripción</label>
        <textarea
          id="est-desc"
          rows={3}
          value={draft.descripcion}
          onChange={(e) => draft.setDescripcion(e.target.value)}
          placeholder="Descripción"
        />
      </div>
    </>
  );
}

function FechasEstudios({ draft }: { draft: ReturnType<typeof useEstudiosDraft> }) {
  return (
    <div className="form-group-inline">
      <div className="form-group">
        <label htmlFor="est-inicio">Fecha inicio</label>
        <input
          id="est-inicio"
          type="month"
          value={draft.fechaInicio}
          onChange={(e) => draft.setFechaInicio(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="est-fin">Fecha fin</label>
        <input
          id="est-fin"
          type="month"
          value={draft.fechaFin}
          onChange={(e) => draft.setFechaFin(e.target.value)}
        />
      </div>
    </div>
  );
}

function FilaEstudio({
  est,
  index,
  total,
  onQuitar,
  onMover,
}: {
  est: CV["estudios"][number];
  index: number;
  total: number;
  onQuitar: (id: string) => void;
  onMover: (id: string, direccion: "arriba" | "abajo") => void;
}) {
  return (
    <tr key={est.id}>
      <td>{est.titulo}</td>
      <td>{est.institucion}</td>
      <td>
        {est.fechaInicio} - {est.fechaFin}
      </td>
      <td>{est.descripcion || "—"}</td>
      <td>
        <BotonesFila
          id={est.id}
          etiqueta={est.titulo}
          index={index}
          total={total}
          onMover={onMover}
          onQuitar={onQuitar}
        />
      </td>
    </tr>
  );
}

function ListaEstudios({
  estudios,
  onQuitar,
  onMover,
}: {
  estudios: CV["estudios"];
  onQuitar: (id: string) => void;
  onMover: (id: string, direccion: "arriba" | "abajo") => void;
}) {
  if (estudios.length === 0) return null;
  return (
    <div className="editor-table-wrap" style={{ marginTop: "var(--spacing-md)" }}>
      <table className="editor-table">
        <caption className="sr-only">Estudios agregados</caption>
        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col">Institución</th>
            <th scope="col">Fechas</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudios.map((est, index) => (
            <FilaEstudio
              key={est.id}
              est={est}
              index={index}
              total={estudios.length}
              onQuitar={onQuitar}
              onMover={onMover}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkillsSection({
  cvData,
  setCvData,
}: {
  cvData?: CV;
  setCvData?: (fn: (prev: CV) => CV) => void;
}) {
  const [draft, setDraft] = React.useState("");
  const [nivel, setNivel] = React.useState<"basico" | "intermedio" | "avanzado" | "experto">(
    "intermedio"
  );
  const habilidades = cvData?.habilidades ?? [];
  const agregar = () => {
    const nombre = draft.trim();
    if (!nombre || !setCvData) return;
    setCvData((prev) => ({
      ...prev,
      habilidades: [...prev.habilidades, { id: crypto.randomUUID(), nombre, nivel }],
    }));
    setDraft("");
    setNivel("intermedio");
  };
  const quitar = (id: string) => {
    setCvData?.((prev) => ({ ...prev, habilidades: prev.habilidades.filter((h) => h.id !== id) }));
  };
  return (
    <section id="panel-habilidades" role="tabpanel" aria-labelledby="tab-habilidades">
      <h2>Habilidades</h2>
      <p className="section-hint">Máximo 20 habilidades</p>
      <FormularioHabilidad
        draft={draft}
        setDraft={setDraft}
        nivel={nivel}
        setNivel={setNivel}
        onAgregar={agregar}
      />
      <ListaHabilidades habilidades={habilidades} onQuitar={quitar} />
    </section>
  );
}

function FormularioHabilidad({
  draft,
  setDraft,
  nivel,
  setNivel,
  onAgregar,
}: {
  draft: string;
  setDraft: (v: string) => void;
  nivel: "basico" | "intermedio" | "avanzado" | "experto";
  setNivel: (v: "basico" | "intermedio" | "avanzado" | "experto") => void;
  onAgregar: () => void;
}) {
  return (
    <div className="form-group-inline skills-input-row">
      <input
        id="habilidad"
        type="text"
        placeholder="Ej: React, TypeScript"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAgregar();
          }
        }}
        className="skills-input"
      />
      <select
        className="skills-level"
        value={nivel}
        onChange={(e) =>
          setNivel(e.target.value as "basico" | "intermedio" | "avanzado" | "experto")
        }
        aria-label="Nivel de habilidad"
      >
        <option value="basico">Básico</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
        <option value="experto">Experto</option>
      </select>
      <button type="button" className="btn btn-secondary" onClick={onAgregar}>
        + Agregar
      </button>
    </div>
  );
}

function ListaHabilidades({
  habilidades,
  onQuitar,
}: {
  habilidades: CV["habilidades"];
  onQuitar: (id: string) => void;
}) {
  if (habilidades.length === 0) return null;
  return (
    <div className="cv-skills" style={{ marginTop: "var(--spacing-md)" }}>
      {habilidades.map((h) => (
        <span key={h.id} className={`cv-skill-tag level-${h.nivel}`}>
          {h.nombre} ({h.nivel})
          <button
            type="button"
            className="skill-remove"
            onClick={() => onQuitar(h.id)}
            aria-label={`Quitar ${h.nombre}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

export function LanguagesSection({
  cvData,
  setCvData,
}: {
  cvData?: CV;
  setCvData?: (fn: (prev: CV) => CV) => void;
}) {
  const [draft, setDraft] = React.useState("");
  const [nivel, setNivel] = React.useState<"basico" | "intermedio" | "avanzado" | "nativo">(
    "intermedio"
  );
  const idiomas = cvData?.idiomas ?? [];
  const agregar = () => {
    const nombre = draft.trim();
    if (!nombre || !setCvData) return;
    setCvData((prev) => ({
      ...prev,
      idiomas: [...prev.idiomas, { id: crypto.randomUUID(), nombre, nivel }],
    }));
    setDraft("");
    setNivel("intermedio");
  };
  const quitar = (id: string) => {
    setCvData?.((prev) => ({ ...prev, idiomas: prev.idiomas.filter((i) => i.id !== id) }));
  };
  return (
    <section id="panel-idiomas" role="tabpanel" aria-labelledby="tab-idiomas">
      <h2>Idiomas</h2>
      <p className="section-hint">Máximo 10 idiomas</p>
      <FormularioIdioma
        draft={draft}
        setDraft={setDraft}
        nivel={nivel}
        setNivel={setNivel}
        onAgregar={agregar}
      />
      <ListaIdiomas idiomas={idiomas} onQuitar={quitar} />
    </section>
  );
}

function FormularioIdioma({
  draft,
  setDraft,
  nivel,
  setNivel,
  onAgregar,
}: {
  draft: string;
  setDraft: (v: string) => void;
  nivel: "basico" | "intermedio" | "avanzado" | "nativo";
  setNivel: (v: "basico" | "intermedio" | "avanzado" | "nativo") => void;
  onAgregar: () => void;
}) {
  return (
    <div className="form-group-inline skills-input-row">
      <input
        id="idioma"
        type="text"
        placeholder="Ej: Inglés"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAgregar();
          }
        }}
        className="skills-input"
      />
      <select
        className="skills-level"
        value={nivel}
        onChange={(e) =>
          setNivel(e.target.value as "basico" | "intermedio" | "avanzado" | "nativo")
        }
        aria-label="Nivel de idioma"
      >
        <option value="basico">Básico</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
        <option value="nativo">Nativo</option>
      </select>
      <button type="button" className="btn btn-secondary" onClick={onAgregar}>
        + Agregar
      </button>
    </div>
  );
}

function ListaIdiomas({
  idiomas,
  onQuitar,
}: {
  idiomas: CV["idiomas"];
  onQuitar: (id: string) => void;
}) {
  if (idiomas.length === 0) return null;
  return (
    <ul className="cv-languages" style={{ marginTop: "var(--spacing-md)" }}>
      {idiomas.map((i) => (
        <li key={i.id} className={`level-${i.nivel === "nativo" ? "experto" : i.nivel}`}>
          {i.nombre} — {i.nivel}
          <button
            type="button"
            className="skill-remove"
            onClick={() => onQuitar(i.id)}
            aria-label={`Quitar ${i.nombre}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}
