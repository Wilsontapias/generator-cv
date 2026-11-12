"use client";

import React from "react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await onSubmit(email, password);
    } catch {
      setError("Credenciales inválidas. Intenta de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <EmailField value={email} onChange={setEmail} disabled={isLoading} />
      <PasswordField value={password} onChange={setPassword} disabled={isLoading} />
      <ErrorDisplay error={error} />
      <SubmitButton isLoading={isLoading} />
    </form>
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
        autoComplete="current-password"
        disabled={disabled}
      />
    </div>
  );
}

function ErrorDisplay({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div aria-live="polite" className="error-container">
      <p className="error-message" role="alert">
        {error}
      </p>
    </div>
  );
}

function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={isLoading}>
      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
    </button>
  );
}

export function LoginFooter() {
  return (
    <div className="login-footer">
      <p>
        ¿No tienes cuenta?{" "}
        <a href="/register" className="link-primary">
          Regístrate
        </a>
      </p>
      <p>
        <a href="/forgot-password" className="link-secondary">
          ¿Olvidaste tu contraseña?
        </a>
      </p>
    </div>
  );
}
