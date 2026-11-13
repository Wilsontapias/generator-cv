// Esquemas Zod para validación de CV
// Compartidos entre cliente y servidor

import { z } from "zod";

// Schema para datos personales
export const datosPersonalesSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  cargo: z.string().max(100, "El cargo no puede exceder 100 caracteres").optional().default(""),
  email: z.string().email("Correo electrónico inválido").or(z.literal("")).optional().default(""),
  telefono: z.string().max(20, "El teléfono no puede exceder 20 caracteres").optional().default(""),
  ciudad: z.string().max(100, "La ciudad no puede exceder 100 caracteres").optional().default(""),
  linkedin: z
    .string()
    .max(200, "El enlace de LinkedIn no puede exceder 200 caracteres")
    .optional()
    .default(""),
  portfolio: z
    .string()
    .max(200, "El enlace del portfolio no puede exceder 200 caracteres")
    .optional()
    .default(""),
  // Pathname del blob privado: usuarios/<uid>/<archivo> (no es una URL pública)
  fotoUrl: z
    .string()
    .max(300, "La ruta de la foto no puede exceder 300 caracteres")
    .regex(/^usuarios\/[A-Za-z0-9_-]+\/[A-Za-z0-9._-]+$/, "Ruta de foto inválida")
    .nullable()
    .default(null),
});

// Schema para perfil profesional
export const perfilSchema = z
  .string()
  .max(500, "El perfil no puede exceder 500 caracteres")
  .optional()
  .default("");

// Schema para experiencia laboral
export const experienciaSchema = z
  .object({
    id: z.string(),
    cargo: z
      .string()
      .min(1, "El cargo es obligatorio")
      .max(100, "El cargo no puede exceder 100 caracteres"),
    empresa: z
      .string()
      .min(1, "La empresa es obligatoria")
      .max(100, "La empresa no puede exceder 100 caracteres"),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin: z.string().optional().default("actual"),
    descripcion: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .optional()
      .default(""),
  })
  .refine(
    (data) => {
      if (data.fechaFin === "actual" || !data.fechaFin) return true;
      return data.fechaInicio <= data.fechaFin;
    },
    { message: "La fecha de inicio debe ser anterior a la fecha de fin", path: ["fechaFin"] }
  );

// Schema para educación
export const estudioSchema = z
  .object({
    id: z.string(),
    titulo: z
      .string()
      .min(1, "El título es obligatorio")
      .max(100, "El título no puede exceder 100 caracteres"),
    institucion: z
      .string()
      .min(1, "La institución es obligatoria")
      .max(100, "La institución no puede exceder 100 caracteres"),
    fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fechaFin: z.string().optional().default(""),
    descripcion: z
      .string()
      .max(300, "La descripción no puede exceder 300 caracteres")
      .optional()
      .default(""),
  })
  .refine(
    (data) => {
      if (!data.fechaFin) return true;
      return data.fechaInicio <= data.fechaFin;
    },
    { message: "La fecha de inicio debe ser anterior a la fecha de fin", path: ["fechaFin"] }
  );

// Schema para habilidades
export const habilidadSchema = z.object({
  id: z.string(),
  nombre: z
    .string()
    .min(1, "El nombre de la habilidad es obligatorio")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  nivel: z.enum(["basico", "intermedio", "avanzado", "experto"]).optional().default("intermedio"),
});

// Schema para idiomas
export const idiomaSchema = z.object({
  id: z.string(),
  nombre: z
    .string()
    .min(1, "El nombre del idioma es obligatorio")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  nivel: z.enum(["basico", "intermedio", "avanzado", "nativo"]).optional().default("intermedio"),
});

// Schema completo del CV
export const cvSchema = z.object({
  datos: datosPersonalesSchema,
  perfil: perfilSchema,
  experiencia: z.array(experienciaSchema).max(10, "Máximo 10 experiencias").optional().default([]),
  estudios: z.array(estudioSchema).max(10, "Máximo 10 estudios").optional().default([]),
  habilidades: z.array(habilidadSchema).max(20, "Máximo 20 habilidades").optional().default([]),
  idiomas: z.array(idiomaSchema).max(10, "Máximo 10 idiomas").optional().default([]),
});

// Schema para crear/actualizar CV
export const crearCvSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es obligatorio")
    .max(100, "El título no puede exceder 100 caracteres"),
  plantilla: z.enum(["moderna", "clasica", "minimalista"]).optional().default("moderna"),
  datos: cvSchema,
});

export const actualizarCvSchema = crearCvSchema.partial();

// Tipos inferidos de los esquemas
export type DatosPersonales = z.infer<typeof datosPersonalesSchema>;
export type Experiencia = z.infer<typeof experienciaSchema>;
export type Estudio = z.infer<typeof estudioSchema>;
export type Habilidad = z.infer<typeof habilidadSchema>;
export type Idioma = z.infer<typeof idiomaSchema>;
export type CV = z.infer<typeof cvSchema>;
export type CrearCV = z.infer<typeof crearCvSchema>;
export type ActualizarCV = z.infer<typeof actualizarCvSchema>;
