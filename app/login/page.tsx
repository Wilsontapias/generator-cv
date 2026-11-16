"use client";

import React from "react";
import "@/styles/login.css";
import { LoginForm, LoginFooter } from "@/components/login/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push("/mis-cv");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Iniciar Sesión</h1>
          <p>Accede a tus hojas de vida</p>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isSubmitting} disabled={authLoading} />
        <LoginFooter />
      </div>
    </div>
  );
}
