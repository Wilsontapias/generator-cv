import React from "react";

interface RegisterFormFieldsProps {
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

export function RegisterFormFields({
  email,
  password,
  confirmPassword,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: RegisterFormFieldsProps) {
  return (
    <>
      <EmailField value={email} onChange={onEmailChange} disabled={isLoading} />
      <PasswordField value={password} onChange={onPasswordChange} disabled={isLoading} />
      <ConfirmPasswordField
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        disabled={isLoading}
      />
    </>
  );
}

function EmailField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="form-group">
      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="tu@email.com"
        required
        autoComplete="email"
        disabled={disabled}
      />
    </div>
  );
}

function PasswordField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="form-group">
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="new-password"
        disabled={disabled}
      />
    </div>
  );
}

function ConfirmPasswordField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="form-group">
      <label htmlFor="confirmPassword">Confirmar contraseña</label>
      <input
        id="confirmPassword"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="new-password"
        disabled={disabled}
      />
    </div>
  );
}

export function RegisterFormError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div aria-live="polite" className="error-container">
      <p className="error-message" role="alert">
        {error}
      </p>
    </div>
  );
}

export function RegisterFormSubmit({ isLoading }: { isLoading: boolean }) {
  return (
    <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={isLoading}>
      {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
    </button>
  );
}
