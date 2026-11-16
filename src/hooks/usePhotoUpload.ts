import { useState, useCallback } from "react";
import { upload } from "@vercel/blob/client";
import { reducirImagen, validarArchivo, mensajeErrorSubida } from "@/services/foto-service";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";

interface UsePhotoUploadResult {
  isUploading: boolean;
  error: string | null;
  uploadPhoto: (file: File, uid: string) => Promise<string | null>;
}

export function usePhotoUpload(): UsePhotoUploadResult {
  const { showLoading, hideLoading } = useLoading();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = useCallback(
    async (file: File, uid: string): Promise<string | null> => {
      setError(null);

      const validation = validarArchivo(file);
      if (!validation.valid) {
        const msg = validation.error || "Archivo inválido";
        setError(msg);
        toast.error(msg);
        return null;
      }

      setIsUploading(true);
      showLoading("Subiendo foto…");

      try {
        const pathname = await subirFoto(file, uid);
        toast.success("Foto actualizada");
        return pathname;
      } catch (err) {
        const msg = mensajeErrorSubida(err);
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setIsUploading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  return { isUploading, error, uploadPhoto };
}

/** Sube la foto reducida a Vercel Blob y notifica al servidor. */
async function subirFoto(file: File, uid: string): Promise<string> {
  const reducedBlob = await reducirImagen(file, 400);
  const reducedFile = new File([reducedBlob], file.name, { type: file.type });

  const pathname = `usuarios/${uid}/foto-perfil.${file.name.split(".").pop()}`;
  const blob = await upload(pathname, reducedFile, {
    access: "private",
    handleUploadUrl: "/api/upload",
  });

  const notifyResponse = await fetch("/api/upload", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pathname: blob.pathname, url: blob.url }),
  });

  if (!notifyResponse.ok) {
    throw new Error("Error al registrar la foto");
  }

  return blob.pathname;
}
