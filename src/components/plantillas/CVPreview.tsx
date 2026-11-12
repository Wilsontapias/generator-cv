import React from "react";
import { PlantillaModerna } from "./PlantillaModerna";
import { PlantillaClasica } from "./PlantillaClasica";
import { PlantillaMinimalista } from "./PlantillaMinimalista";
import type { CV } from "@/schemas/cv";

interface CVPreviewProps {
  data: CV;
  template: string;
}

export function CVPreview({ data, template }: CVPreviewProps) {
  switch (template) {
    case "clasica":
      return <PlantillaClasica data={data} />;
    case "minimalista":
      return <PlantillaMinimalista data={data} />;
    case "moderna":
    default:
      return <PlantillaModerna data={data} />;
  }
}
