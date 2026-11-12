import React from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type = "info", isVisible, onClose }: ToastProps) {
  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar notificación">
        ×
      </button>
    </div>
  );
}
