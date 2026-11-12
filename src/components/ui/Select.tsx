import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export function Select({ label, options, error, hint, id, className = "", ...props }: SelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className="form-group">
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        className={`select ${error ? "input-error" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
