"use client";

import React from "react";
import { LoadingState, ErrorState, EmptyState, CVList } from "@/components/mis-cv/MisCVContent";
import { Toast } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useCVList } from "@/hooks/useCVList";

export default function MisCVPage() {
  const { user } = useAuth();
  const {
    cvs,
    isLoading,
    isCreating,
    error,
    errorCreacion,
    limpiarErrorCreacion,
    loadCVs,
    createCV,
    deleteCV,
  } = useCVList();

  React.useEffect(() => {
    if (user) loadCVs();
  }, [user, loadCVs]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={loadCVs} />;

  return (
    <>
      <Toast
        message={errorCreacion}
        type="error"
        isVisible={Boolean(errorCreacion)}
        onClose={limpiarErrorCreacion}
      />
      {cvs.length === 0 ? (
        <EmptyState onCreateCV={createCV} isCreating={isCreating} />
      ) : (
        <CVList cvs={cvs} onCreateCV={createCV} onDeleteCV={deleteCV} isCreating={isCreating} />
      )}
    </>
  );
}
