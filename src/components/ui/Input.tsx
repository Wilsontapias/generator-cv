import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = "", ...props }: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        className={`input ${error ? "input-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="error-message" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="hint-message">
          {hint}
        </p>
      )}
    </div>
  );
}
