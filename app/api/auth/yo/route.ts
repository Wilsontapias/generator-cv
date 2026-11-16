import { manejar } from "@/lib/http";
import { requerirUsuario } from "@/lib/auth";
import { getAdminAuth } from "@/lib/firebase-admin";

export const GET = manejar(async (request) => {
  const uid = await requerirUsuario(request);
  const user = await getAdminAuth().getUser(uid);

  return {
    body: {
      usuario: {
        uid: user.uid,
        correo: user.email || null,
        rol: (user.customClaims?.rol as string) || "usuario",
      },
    },
  };
});
