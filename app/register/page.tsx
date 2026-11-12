"use client";

import React, { useState } from "react";
import Link from "next/link";
import "@/styles/login.css";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  RegisterFormFields,
  RegisterFormError,
  RegisterFormSubmit,
} from "@/components/register/RegisterFormFields";

export default function RegisterPage() {
  const { register, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRegister = async (email: string, password: string) => {
    setError("");
    try {
      await register(email, password);
      router.push("/mis-cv");
    } catch (err) {
      console.error("Error de registro:", err);
      setError("Error al crear la cuenta. Intenta de nuevo.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Crear Cuenta</h1>
          <p>Comienza a crear tu hoja de vida</p>
        </div>

        <RegisterForm onSubmit={handleRegister} isLoading={authLoading} error={error} />
        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="link-primary">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function RegisterForm({
  onSubmit,
  isLoading,
  error,
}: {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      await onSubmit(email, password);
    } catch {
      setLocalError("Error al crear la cuenta. Intenta de nuevo.");
    }
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <RegisterFormFields
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        isLoading={isLoading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
      />
      <RegisterFormError error={displayError} />
      <RegisterFormSubmit isLoading={isLoading} />
    </form>
  );
}
