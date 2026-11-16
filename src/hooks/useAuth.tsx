"use client";

import { useState, useEffect, createContext, useContext } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase-client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createSessionCookie = async (idToken: string) => {
  const response = await fetch("/api/auth/sesion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al crear sesión");
  }
};

async function deleteSessionCookie() {
  await fetch("/api/auth/sesion", {
    method: "DELETE",
  });
}

function errorCode(error: unknown): string | undefined {
  return (error as { code?: string } | null)?.code;
}

function mapLoginError(error: unknown): string {
  const code = errorCode(error);
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-email":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde.";
    case "auth/user-disabled":
      return "Esta cuenta está deshabilitada.";
    default:
      return "No se pudo iniciar sesión. Intenta de nuevo.";
  }
}

function mapRegisterError(error: unknown): string {
  const code = errorCode(error);
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/weak-password":
      return "La contraseña es muy débil (mínimo 6 caracteres).";
    case "auth/invalid-email":
      return "Correo electrónico inválido.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Intenta más tarde.";
    default:
      return "No se pudo crear la cuenta. Intenta de nuevo.";
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // Forzar refresh del token para obtener auth_time reciente
      const idToken = await credential.user.getIdToken(true);
      await createSessionCookie(idToken);
    } catch (error) {
      throw new Error(mapLoginError(error));
    }
  };

  const register = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Forzar refresh del token para obtener auth_time reciente
      const idToken = await credential.user.getIdToken(true);
      await createSessionCookie(idToken);
    } catch (error) {
      throw new Error(mapRegisterError(error));
    }
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth no está inicializado");

    await signOut(auth);
    await deleteSessionCookie();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
