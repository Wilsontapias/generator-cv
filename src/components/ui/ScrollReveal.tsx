"use client";

import { useEffect } from "react";

const VISIBLE_VIEWPORT_RATIO = 1;

export function ScrollReveal() {
  useEffect(() => {
    // Se difiere para no mutar el DOM mientras React termina la hidratación
    // (evita el warning "hydrated but ... didn't match").
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        if (cancelled) return;
        cleanup = ejecutarReveal();
      });
      // guardar raf2 para cancelar
      (window as unknown as { __revealRaf2?: number }).__revealRaf2 = raf2;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      const raf2 = (window as unknown as { __revealRaf2?: number }).__revealRaf2;
      if (raf2) cancelAnimationFrame(raf2);
      cleanup?.();
    };
  }, []);

  return null;
}

/** Marca todos los elementos [data-reveal] visibles; anima solo los que entran después. */
function ejecutarReveal(): (() => void) | null {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const markVisible = (element: HTMLElement, animate: boolean) => {
    element.dataset.revealState = "done";
    element.classList.remove("reveal-pending");
    if (animate) {
      element.classList.add("is-revealing");
    }
  };

  if (reduceMotion.matches) {
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((element) => markVisible(element, false));
    return null;
  }

  return crearObservador(markVisible);
}

/** Registra los elementos fuera de pantalla y observa cambios del DOM. */
function crearObservador(
  markVisible: (element: HTMLElement, animate: boolean) => void
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markVisible(entry.target as HTMLElement, true);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  const register = (node: Element) => {
    const element = node as HTMLElement;
    if (element.dataset.revealState) return;

    element.dataset.revealState = "pending";
    const rect = element.getBoundingClientRect();

    // Lo que ya está en pantalla se muestra sin animación para evitar parpadeos.
    if (rect.top < window.innerHeight * VISIBLE_VIEWPORT_RATIO) {
      markVisible(element, false);
      return;
    }

    element.classList.add("reveal-pending");
    observer.observe(element);
  };

  const scan = () => document.querySelectorAll("[data-reveal]").forEach(register);

  scan();
  const mutations = new MutationObserver(scan);
  mutations.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    mutations.disconnect();
  };
}
