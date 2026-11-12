"use client";

import React from "react";
import { AuthProvider } from "@/hooks/useAuth";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
