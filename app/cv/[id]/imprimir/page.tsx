import React from "react";
import { notFound, redirect } from "next/navigation";
import "@/styles/print.css";
import { PrintView } from "@/components/print/PrintView";
import { requerirUsuario } from "@/lib/auth";
import { obtenerCV } from "@/services/cv-service";

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let uid: string;
  try {
    uid = await requerirUsuario();
  } catch {
    redirect("/login");
    return null as never;
  }

  const cv = await obtenerCV(uid, id).catch(() => null);
  if (!cv) notFound();

  return <PrintView cvId={id} data={cv.datos} template={cv.plantilla || "moderna"} />;
}
