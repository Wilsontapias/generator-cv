import React from "react";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-content">
        <h1 id="hero-title">Crea tu hoja de vida profesional</h1>
        <p className="hero-subtitle">
          Diseña tu CV con plantillas modernas, vista previa en vivo y exportación a PDF. Perfecto
          para tu primer empleo o prácticas.
        </p>
        <div className="hero-actions">
          <a href="/login" className="btn btn-primary btn-lg">
            Comenzar ahora
          </a>
          <a href="#caracteristicas" className="btn btn-secondary btn-lg">
            Conocer más
          </a>
        </div>
      </div>
    </section>
  );
}
