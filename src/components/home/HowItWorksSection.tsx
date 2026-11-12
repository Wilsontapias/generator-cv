import React from "react";

const steps = [
  {
    number: 1,
    title: "Crea tu cuenta",
    description: "Regístrate en segundos con tu correo electrónico.",
  },
  {
    number: 2,
    title: "Completa tu información",
    description:
      "Llena las secciones: datos personales, experiencia, educación, habilidades e idiomas.",
  },
  {
    number: 3,
    title: "Elige tu plantilla",
    description: "Selecciona entre 3 diseños profesionales y personaliza los colores.",
  },
  {
    number: 4,
    title: "Descarga tu CV",
    description: "Exporta a PDF y compártelo con empleadores potenciales.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="how-it-works" aria-labelledby="how-title">
      <h2 id="how-title">¿Cómo funciona?</h2>
      <div className="steps">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
