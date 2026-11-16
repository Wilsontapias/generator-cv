"use client";

import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingProvider } from "@/hooks/useLoading";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </AuthProvider>
    </LoadingProvider>
  );
}
