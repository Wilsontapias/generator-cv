"use client";

import React from "react";

export function LoginFormFields({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
}: {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="tu@email.com"
          required
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />
      </div>
    </>
  );
}

export function LoginFormError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div aria-live="polite" className="error-container">
      <p className="error-message" role="alert">
        {error}
      </p>
    </div>
  );
}

export function LoginFormSubmit({ isLoading }: { isLoading: boolean }) {
  return (
    <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={isLoading}>
      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
    </button>
  );
}
