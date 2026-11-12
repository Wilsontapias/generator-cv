"use client";

import React from "react";
import { LoadingState, ErrorState, EmptyState, CVList } from "@/components/mis-cv/MisCVContent";
import { useAuth } from "@/hooks/useAuth";
import { useCVList } from "@/hooks/useCVList";

export default function MisCVPage() {
  const { user } = useAuth();
  const { cvs, isLoading, error, loadCVs, createCV, deleteCV } = useCVList();

  React.useEffect(() => {
    if (user) loadCVs();
  }, [user, loadCVs]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={loadCVs} />;
  if (cvs.length === 0) return <EmptyState onCreateCV={createCV} />;
  return <CVList cvs={cvs} onCreateCV={createCV} onDeleteCV={deleteCV} />;
}
