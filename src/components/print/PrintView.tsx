"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CVPreview } from "@/components/plantillas/CVPreview";
import { Spinner } from "@/components/ui/Spinner";
import { useLoading } from "@/hooks/useLoading";
import type { CV } from "@/schemas/cv";

interface PrintViewProps {
  cvId: string;
  data: CV;
  template: string;
}

export function PrintView({ cvId, data, template }: PrintViewProps) {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();
  const [showPhoto, setShowPhoto] = React.useState(true);
  const [isPrinting, setIsPrinting] = React.useState(false);

  React.useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  const handlePrint = () => {
    setIsPrinting(true);
    window.setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };
  const handleBack = () => {
    showLoading("Volviendo al editor…");
    router.push(`/cv/${cvId}/editar`);
  };

  const previewData: CV = showPhoto ? data : { ...data, datos: { ...data.datos, fotoUrl: null } };

  return (
    <>
      <div className="print-page">
        <PrintControlsBar
          showPhoto={showPhoto}
          setShowPhoto={setShowPhoto}
          isPrinting={isPrinting}
          handlePrint={handlePrint}
          handleBack={handleBack}
        />
        <div className="cv-print">
          <CVPreview data={previewData} template={template} />
        </div>
      </div>
    </>
  );
}

function PrintControlsBar({
  showPhoto,
  setShowPhoto,
  isPrinting,
  handlePrint,
  handleBack,
}: {
  showPhoto: boolean;
  setShowPhoto: (v: boolean) => void;
  isPrinting: boolean;
  handlePrint: () => void;
  handleBack: () => void;
}) {
  return (
    <div className="print-controls noprint">
      <h2>Imprimir CV</h2>
      <div className="print-options">
        <label>
          <input
            type="checkbox"
            checked={showPhoto}
            onChange={(e) => setShowPhoto(e.target.checked)}
          />{" "}
          Mostrar foto
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrint}
          disabled={isPrinting}
        >
          {isPrinting && <Spinner />} {isPrinting ? "Preparando…" : "Imprimir / Descargar PDF"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Atrás
        </button>
      </div>
    </div>
  );
}
