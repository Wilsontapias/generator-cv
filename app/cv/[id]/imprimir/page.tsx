import React from "react";
import "@/styles/print.css";
import { PrintControls, CVPrintContent } from "@/components/print/PrintContent";

export default function PrintPage() {
  return (
    <div className="print-page">
      <PrintControls />
      <CVPrintContent />
    </div>
  );
}
