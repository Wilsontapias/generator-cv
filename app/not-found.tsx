import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404 - Página no encontrada</h1>
      <p>La página que buscas no existe o ha sido movida.</p>
      <Link href="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
