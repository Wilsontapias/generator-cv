import React, { useRef } from "react";
import Image from "next/image";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { useAuth } from "@/hooks/useAuth";

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoChange: (url: string | null) => void;
}

export function PhotoUpload({ currentPhotoUrl, onPhotoChange }: PhotoUploadProps) {
  const { user } = useAuth();
  const { isUploading, error, uploadPhoto } = usePhotoUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const url = await uploadPhoto(file, user.uid);
    if (url) {
      onPhotoChange(url);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
  };

  return (
    <div className="photo-upload">
      <PhotoPreview currentPhotoUrl={currentPhotoUrl} />
      <PhotoActions
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        currentPhotoUrl={currentPhotoUrl}
        onFileSelect={handleFileSelect}
        onRemovePhoto={handleRemovePhoto}
      />
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <p className="photo-hint">
        Formatos: JPEG, PNG, WebP. Máximo 5MB. Se reducirá automáticamente.
      </p>
    </div>
  );
}

function PhotoPreview({ currentPhotoUrl }: { currentPhotoUrl: string | null }) {
  if (currentPhotoUrl) {
    return (
      <div className="photo-preview">
        <Image
          src={currentPhotoUrl}
          alt="Foto de perfil"
          width={120}
          height={120}
          className="photo-image"
        />
      </div>
    );
  }
  return (
    <div className="photo-preview">
      <div className="photo-placeholder">
        <span aria-hidden="true">📷</span>
        <span>Sin foto</span>
      </div>
    </div>
  );
}

function PhotoActions({
  fileInputRef,
  isUploading,
  currentPhotoUrl,
  onFileSelect,
  onRemovePhoto,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  currentPhotoUrl: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
}) {
  return (
    <div className="photo-actions">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileSelect}
        className="photo-input"
        aria-label="Seleccionar foto de perfil"
        disabled={isUploading}
      />
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? "Subiendo..." : "Subir foto"}
      </button>
      {currentPhotoUrl && (
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={onRemovePhoto}
          disabled={isUploading}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
