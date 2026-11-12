import React from "react";

const features = [
  {
    icon: "📝",
    title: "Editor intuitivo",
    description:
      "Formulario por secciones con validación en tiempo real. Completa tu información paso a paso sin complicaciones.",
  },
  {
    icon: "🎨",
    title: "3 plantillas profesionales",
    description:
      "Elige entre diseños modernos, clásicos o minimalistas. Todas optimizadas para impresión y pantalla.",
  },
  {
    icon: "👁️",
    title: "Vista previa en vivo",
    description:
      "Ve cómo se ve tu CV mientras lo editas. Cambia entre plantillas al instante sin perder tu información.",
  },
  {
    icon: "📄",
    title: "Exportar a PDF",
    description:
      "Descarga tu CV en formato PDF listo para enviar. Optimizado para impresión profesional.",
  },
  {
    icon: "🔒",
    title: "Privado y seguro",
    description:
      "Tus datos están protegidos. Decide si quieres compartir tu CV con un enlace público opcional.",
  },
  {
    icon: "💾",
    title: "Guardado automático",
    description:
      "Tu trabajo se guarda automáticamente. Accede a tus CVs desde cualquier dispositivo cuando quieras.",
  },
];

export function FeaturesSection() {
  return (
    <section id="caracteristicas" className="features" aria-labelledby="features-title">
      <h2 id="features-title">¿Por qué usar GeneradorCV?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <article key={index} className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
