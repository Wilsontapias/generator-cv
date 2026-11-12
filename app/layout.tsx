import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "@/styles/globals.css";
import "@/styles/ui.css";
import "@/styles/templates.css";
import { ClientLayout } from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Generador de Hoja de Vida | Crea tu CV profesional",
  description:
    "Crea tu hoja de vida profesional con plantillas modernas. Editor intuitivo con vista previa en vivo y exportación a PDF.",
  keywords: ["hoja de vida", "CV", "resume", "generador", "plantillas"],
  authors: [{ name: "Wilson Tapias Posada" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido
        </a>
        <ClientLayout>
          <header className="app-header" role="banner">
            <nav className="app-nav" aria-label="Navegación principal">
              <div className="nav-container">
                <Link href="/" className="nav-logo">
                  GeneradorCV
                </Link>
                <ul className="nav-links">
                  <li>
                    <Link href="/mis-cv">Mis CVs</Link>
                  </li>
                  <li>
                    <Link href="/login">Iniciar Sesión</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <main id="main-content" role="main">
            {children}
          </main>
          <footer className="app-footer" role="contentinfo">
            <div className="footer-container">
              <p>&copy; 2026 GeneradorCV. Proyecto de Desarrollo Web.</p>
              <p>
                Creado por <a href="mailto:wilson.tapias@ejemplo.com">Wilson Tapias Posada</a>
              </p>
            </div>
          </footer>
        </ClientLayout>
      </body>
    </html>
  );
}
