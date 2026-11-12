// Configuración de Firebase para el cliente (SDK web)
// Solo datos públicos que pueden estar en el navegador

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase solo en el cliente
export const firebaseApp = typeof window !== "undefined" ? initializeApp(firebaseConfig) : null;

// Obtener instancia de Auth
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
