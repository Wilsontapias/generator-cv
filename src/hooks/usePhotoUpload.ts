"use client";

import { useState, useCallback } from "react";
import { upload } from "@vercel/blob/client";
import { reducirImagen, validarArchivo } from "@/services/foto-service";

interface UsePhotoUploadResult {
  isUploading: boolean;
  error: string | null;
  uploadPhoto: (file: File, uid: string) => Promise<string | null>;
}

export function usePhotoUpload(): UsePhotoUploadResult {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = useCallback(async (file: File, uid: string): Promise<string | null> => {
    setError(null);

    // Validar archivo
    const validation = validarArchivo(file);
    if (!validation.valid) {
      setError(validation.error || "Archivo inválido");
      return null;
    }

    setIsUploading(true);

    try {
      // Reducir imagen en navegador
      const reducedBlob = await reducirImagen(file, 400);

      // Crear un nuevo File con la imagen reducida
      const reducedFile = new File([reducedBlob], file.name, { type: file.type });

      // Subir a Vercel Blob (store privado)
      const pathname = `usuarios/${uid}/foto-perfil.${file.name.split(".").pop()}`;
      const blob = await upload(pathname, reducedFile, {
        access: "private",
        handleUploadUrl: "/api/upload",
      });

      // Notificar al servidor
      const notifyResponse = await fetch("/api/upload", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname: blob.pathname,
          url: blob.url,
        }),
      });

      if (!notifyResponse.ok) {
        throw new Error("Error al registrar la foto");
      }

      // Se guarda el pathname; la foto se sirve por /api/foto verificando al dueño
      return blob.pathname;
    } catch (err) {
      console.error("Error subiendo foto:", err);
      setError(err instanceof Error ? err.message : "Error al subir la foto");
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { isUploading, error, uploadPhoto };
}
