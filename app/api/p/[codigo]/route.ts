import { manejar } from "@/lib/http";
import { obtenerCVPublico } from "@/services/cv-service";

export const GET = manejar(async (request, context) => {
  const params = await context.params;
  const codigo = params?.codigo || "";
  const cv = await obtenerCVPublico(codigo);

  return {
    body: cv,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  };
});
