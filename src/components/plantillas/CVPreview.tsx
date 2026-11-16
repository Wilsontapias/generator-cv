import dynamic from "next/dynamic";
import type { CV } from "@/schemas/cv";

const PlantillaModerna = dynamic(() =>
  import("./PlantillaModerna").then((m) => m.PlantillaModerna)
);
const PlantillaClasica = dynamic(() =>
  import("./PlantillaClasica").then((m) => m.PlantillaClasica)
);
const PlantillaMinimalista = dynamic(() =>
  import("./PlantillaMinimalista").then((m) => m.PlantillaMinimalista)
);
const PlantillaCorporativa = dynamic(() =>
  import("./PlantillaCorporativa").then((m) => m.PlantillaCorporativa)
);

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
    case "corporativa":
      return <PlantillaCorporativa data={data} />;
    case "moderna":
    default:
      return <PlantillaModerna data={data} />;
  }
}
