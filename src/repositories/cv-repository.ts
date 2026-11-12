// Repositorio de acceso a Firestore para CVs

import "server-only";

import { getAdminFirestore } from "@/lib/firebase-admin";
import type { CV, CrearCV, ActualizarCV } from "@/schemas/cv";

const COLLECTION = "cvs";

export interface CVDocument {
  id: string;
  uid: string;
  titulo: string;
  plantilla: string;
  publica: boolean;
  codigo: string | null;
  datos: CV;
  fotoUrl: string | null;
  actualizadoEn: string;
}

export async function crearCV(uid: string, data: CrearCV): Promise<CVDocument> {
  const db = getAdminFirestore();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const cv: CVDocument = {
    id,
    uid,
    titulo: data.titulo,
    plantilla: data.plantilla || "moderna",
    publica: false,
    codigo: null,
    datos: data.datos,
    fotoUrl: null,
    actualizadoEn: now,
  };

  await db.collection("usuarios").doc(uid).collection(COLLECTION).doc(id).set(cv);

  return cv;
}

export async function obtenerCV(uid: string, id: string): Promise<CVDocument | null> {
  const db = getAdminFirestore();
  const doc = await db.collection("usuarios").doc(uid).collection(COLLECTION).doc(id).get();

  if (!doc.exists) return null;
  return doc.data() as CVDocument;
}

export async function obtenerCVsPorUsuario(uid: string): Promise<CVDocument[]> {
  const db = getAdminFirestore();
  const snapshot = await db
    .collection("usuarios")
    .doc(uid)
    .collection(COLLECTION)
    .orderBy("actualizadoEn", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data() as CVDocument);
}

export async function actualizarCV(
  uid: string,
  id: string,
  data: ActualizarCV
): Promise<CVDocument | null> {
  const db = getAdminFirestore();
  const ref = db.collection("usuarios").doc(uid).collection(COLLECTION).doc(id);
  const doc = await ref.get();

  if (!doc.exists) return null;

  const existing = doc.data() as CVDocument;
  const updated: CVDocument = {
    ...existing,
    ...data,
    actualizadoEn: new Date().toISOString(),
  };

  await ref.set(updated);
  return updated;
}

export async function eliminarCV(uid: string, id: string): Promise<boolean> {
  const db = getAdminFirestore();
  const ref = db.collection("usuarios").doc(uid).collection(COLLECTION).doc(id);
  const doc = await ref.get();

  if (!doc.exists) return false;

  await ref.delete();
  return true;
}

export async function obtenerCVPublico(codigo: string): Promise<CVDocument | null> {
  const db = getAdminFirestore();
  // Buscar en todos los usuarios (solo CVs públicos)
  const snapshot = await db
    .collectionGroup(COLLECTION)
    .where("codigo", "==", codigo)
    .where("publica", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const firstDoc = snapshot.docs[0];
  if (!firstDoc) return null;
  return firstDoc.data() as CVDocument;
}
