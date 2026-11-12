import React from "react";

export function CtaFinalSection() {
  return (
    <section className="cta-final" aria-labelledby="cta-title">
      <h2 id="cta-title">¿Listo para crear tu CV profesional?</h2>
      <p>Comienza ahora y destaca entre los candidatos.</p>
      <a href="/login" className="btn btn-primary btn-lg">
        Crear mi CV gratis
      </a>
    </section>
  );
}
