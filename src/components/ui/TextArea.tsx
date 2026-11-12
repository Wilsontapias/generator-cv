import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  maxLength?: number;
}

function getDescribedBy(error: string | undefined, hint: string | undefined, inputId: string) {
  if (error) return `${inputId}-error`;
  if (hint) return `${inputId}-hint`;
  return undefined;
}

export function TextArea({
  label,
  error,
  hint,
  id,
  maxLength,
  value,
  className = "",
  ...props
}: TextAreaProps) {
  const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const currentLength = typeof value === "string" ? value.length : 0;
  const describedBy = getDescribedBy(error, hint, inputId);

  return (
    <div className="form-group">
      <label htmlFor={inputId}>{label}</label>
      <textarea
        id={inputId}
        className={`textarea ${error ? "input-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {maxLength && (
        <span className="char-counter">
          {currentLength}/{maxLength}
        </span>
      )}
      {error && (
        <p id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="hint-message">
          {hint}
        </p>
      )}
    </div>
  );
}
