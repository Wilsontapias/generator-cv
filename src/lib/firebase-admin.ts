// Configuración de Firebase Admin SDK (solo servidor)
// NUNCA importar este archivo en componentes del cliente

import "server-only";

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getFirebaseAdmin() {
  if (getApps().length > 0) {
    const app = getApps()[0];
    if (app) {
      return app;
    }
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!privateKey || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PROJECT_ID) {
    throw new Error("Faltan variables de entorno de Firebase Admin");
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

// Singleton para evitar múltiples inicializaciones
let adminApp: App;

export function getAdminApp(): App {
  if (!adminApp) {
    adminApp = getFirebaseAdmin();
  }
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}
