"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    __webVitals?: Array<Record<string, unknown>>;
  }
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (typeof window !== "undefined") {
      window.__webVitals = window.__webVitals || [];
      window.__webVitals.push(metric as unknown as Record<string, unknown>);
    }
  });
  return null;
}
