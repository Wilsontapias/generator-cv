// Servicio de gestión de fotos de perfil

import { del } from "@vercel/blob";
import { ForbiddenError, NotFoundError } from "@/lib/errors";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validarArchivo(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Tipo de archivo no permitido. Use JPEG, PNG o WebP." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "El archivo excede el tamaño máximo de 5MB." };
  }

  return { valid: true };
}

export function reducirImagen(file: File, maxWidth: number = 400): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Error al reducir imagen"));
          },
          file.type,
          0.8
        );
      } else {
        reject(new Error("No se pudo obtener contexto de canvas"));
      }
    };

    img.onerror = () => reject(new Error("Error al cargar imagen"));
    img.src = URL.createObjectURL(file);
  });
}

export async function eliminarFoto(pathname: string, uid: string): Promise<void> {
  // Verificar que el pathname pertenezca al usuario
  if (!pathname.startsWith(`usuarios/${uid}/`)) {
    throw new ForbiddenError("No tiene permiso para eliminar este archivo");
  }

  try {
    await del(pathname);
  } catch {
    throw new NotFoundError("Archivo no encontrado");
  }
}

export function generarPathname(uid: string, filename: string): string {
  const extension = filename.split(".").pop() || "jpg";
  return `usuarios/${uid}/foto-perfil.${extension}`;
}
