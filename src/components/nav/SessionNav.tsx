"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useLoading } from "@/hooks/useLoading";
import { nombreDesdeUsuario } from "@/utils/nombreUsuario";
import { Icon } from "@/components/ui/Icon";

async function cerrarSesion(
  logout: () => Promise<void>,
  setOcupado: (v: boolean) => void,
  showLoading: (msg?: string) => void,
  hideLoading: () => void
) {
  try {
    setOcupado(true);
    showLoading("Cerrando sesión…");
    await logout();
    window.location.assign("/");
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    setOcupado(false);
    hideLoading();
  }
}

/** Menú desplegable: se cierra al pulsar fuera o con Escape. */
function useMenuSesion() {
  const [abierto, setAbierto] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const pulsarFuera = (evento: MouseEvent) => {
      if (!itemRef.current?.contains(evento.target as Node)) setAbierto(false);
    };
    const pulsarEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };

    document.addEventListener("mousedown", pulsarFuera);
    document.addEventListener("keydown", pulsarEscape);
    return () => {
      document.removeEventListener("mousedown", pulsarFuera);
      document.removeEventListener("keydown", pulsarEscape);
    };
  }, [abierto]);

  return { abierto, setAbierto, itemRef };
}

/**
 * Estado de sesión en la navegación principal:
 * sin sesión → "Iniciar Sesión"; con sesión → botón con el nombre que abre
 * un menú con el saludo y la opción "Cerrar sesión".
 */
export function SessionNav() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <li>
        <span className="nav-session-loading" aria-hidden="true" />
        <span className="sr-only">Cargando sesión…</span>
      </li>
    );
  }

  if (!user) {
    return (
      <li>
        <Link href="/login">Iniciar Sesión</Link>
      </li>
    );
  }

  return (
    <>
      <li>
        <Link href="/mis-cv">Mis CVs</Link>
      </li>
      <MenuSesion user={user} logout={logout} />
    </>
  );
}

/** Botón con el nombre del usuario y el menú desplegable de sesión. */
function MenuSesion({ user, logout }: { user: User; logout: () => Promise<void> }) {
  const { abierto, setAbierto, itemRef } = useMenuSesion();
  const { showLoading, hideLoading } = useLoading();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const nombre = nombreDesdeUsuario(user);
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <li className="nav-user" ref={itemRef}>
      <button
        type="button"
        className="nav-user-btn"
        aria-expanded={abierto}
        aria-controls="menu-sesion"
        onClick={() => setAbierto(!abierto)}
      >
        <span className="nav-avatar" aria-hidden="true">
          {inicial}
        </span>
        <span className="nav-user-name">{nombre}</span>
        <Icon name="chevronDown" className={abierto ? "nav-chevron is-open" : "nav-chevron"} />
      </button>

      {abierto && (
        <div className="nav-user-menu" id="menu-sesion">
          <p className="nav-user-greeting">Hola, {nombre}</p>
          {user.email && <p className="nav-user-email">{user.email}</p>}
          <button
            type="button"
            className="nav-user-menu-item"
            onClick={() => void cerrarSesion(logout, setIsLoggingOut, showLoading, hideLoading)}
            disabled={isLoggingOut}
          >
            <Icon name="logout" />
            {isLoggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </div>
      )}
    </li>
  );
}
