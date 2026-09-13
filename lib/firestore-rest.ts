import { cookies } from "next/headers";

export type NoticiaData = {
  titulo: string;
  categoria: string;
  fecha: string;
  descripcion: string;
  contenido: string;
  imagen: string;
};

export type FirestoreFieldValue = {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
};

export type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreFieldValue>;
};

export class FirestoreRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

function getBaseUrl(path: string) {
  if (!projectId || !apiKey) {
    throw new FirestoreRequestError("Falta la configuración de Firebase", 500);
  }
  const separator = path.includes("?") ? "&" : "?";
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}${separator}key=${apiKey}`;
}

export async function firestoreRequest(
  path: string,
  init: RequestInit = {},
  providedToken?: string | null,
) {
  const token = providedToken ?? (await cookies()).get("token")?.value ?? null;
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(getBaseUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new FirestoreRequestError(
      `${body?.error?.message || "Firebase rechazó la solicitud"} (${token ? "sesión Firebase enviada" : "sin sesión Firebase"})`,
      response.status,
    );
  }
  return response.json();
}

/**
 * Petición a Firestore SIN token de autenticación.
 * Usa solo la API Key pública. Requiere que las Firestore Rules
 * permitan la operación sin auth (allow read, write: if true).
 * Usar para colecciones públicas como "galeria".
 */
export async function firestorePublicRequest(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  // NO enviamos el token JWT de MySQL — Firebase lo rechazaría

  const response = await fetch(getBaseUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new FirestoreRequestError(
      body?.error?.message || "Firebase rechazó la solicitud (sin sesión)",
      response.status,
    );
  }
  return response.json();
}


export function noticiaToFirestoreFields(noticia: NoticiaData) {
  return Object.fromEntries(
    Object.entries(noticia).map(([key, value]) => [key, { stringValue: value }]),
  );
}

export function firestoreDocumentToNoticia(document: FirestoreDocument) {
  const fields = document.fields || {};
  return {
    id: document.name.split("/").pop(),
    titulo: fields.titulo?.stringValue || "",
    categoria: fields.categoria?.stringValue || "",
    fecha: fields.fecha?.stringValue || "",
    descripcion: fields.descripcion?.stringValue || "",
    contenido: fields.contenido?.stringValue || "",
    imagen: fields.imagen?.stringValue || "",
  };
}

export type GaleriaData = {
  imagen: string;
  fecha?: string;
};

export function galeriaToFirestoreFields(item: GaleriaData) {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, { stringValue: String(value || "") }]),
  );
}

export function firestoreDocumentToGaleria(document: FirestoreDocument) {
  const fields = document.fields || {};
  return {
    id: document.name.split("/").pop(),
    imagen: fields.imagen?.stringValue || "",
    fecha: fields.fecha?.stringValue || "",
  };
}

export type UsuarioData = {
  uid?: string;
  nombre: string;
  email: string;
  rol?: string;
  estado?: string;
  ultimoAcceso?: string;
  fechaCreacion?: string;
};

export function usuarioToFirestoreFields(usuario: Partial<UsuarioData>) {
  return Object.fromEntries(
    Object.entries(usuario)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return [key, { stringValue: value }];
        }
        if (typeof value === "number") {
          return [key, { integerValue: String(value) }];
        }
        if (typeof value === "boolean") {
          return [key, { booleanValue: value }];
        }
        return [key, { stringValue: String(value) }];
      }),
  );
}

export function firestoreDocumentToUsuario(document: FirestoreDocument) {
  const fields = document.fields || {};

  return {
    id: document.name.split("/").pop() || "",
    uid: fields.uid?.stringValue || "",
    nombre: fields.nombre?.stringValue || "",
    email: fields.email?.stringValue || "",
    rol: fields.rol?.stringValue || "coordinador",
    estado: fields.estado?.stringValue || "activo",
    ultimoAcceso:
      fields.ultimoAcceso?.stringValue ||
      fields.ultimo_acceso?.stringValue ||
      "",
    fechaCreacion:
      fields.fechaCreacion?.stringValue ||
      fields.fecha_creacion?.stringValue ||
      fields.createdAt?.stringValue ||
      new Date().toISOString(),
  };
}

export type VoluntarioData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  cedula?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  profesion?: string;
  disponibilidad?: string;
  estado?: string;
  programa?: string;
  fecha_creacion?: string;
};

export function voluntarioToFirestoreFields(voluntario: Partial<VoluntarioData>) {
  return Object.fromEntries(
    Object.entries(voluntario)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (typeof value === "string") {
          return [key, { stringValue: value }];
        }
        if (typeof value === "number") {
          return [key, { integerValue: String(value) }];
        }
        if (typeof value === "boolean") {
          return [key, { booleanValue: value }];
        }
        return [key, { stringValue: String(value) }];
      }),
  );
}

export function firestoreDocumentToVoluntario(document: FirestoreDocument) {
  const fields = document.fields || {};
  return {
    id: document.name.split("/").pop() || "",
    nombre: fields.nombre?.stringValue || "",
    apellido: fields.apellido?.stringValue || "",
    email: fields.email?.stringValue || "",
    telefono: fields.telefono?.stringValue || "",
    cedula: fields.cedula?.stringValue || "",
    direccion: fields.direccion?.stringValue || "",
    fecha_nacimiento:
      fields.fecha_nacimiento?.stringValue ||
      fields.fechaNacimiento?.stringValue ||
      "",
    profesion: fields.profesion?.stringValue || "",
    disponibilidad: fields.disponibilidad?.stringValue || "",
    estado: fields.estado?.stringValue || "activo",
    programa: fields.programa?.stringValue || "",
    fecha_creacion:
      fields.fecha_creacion?.stringValue ||
      fields.fechaCreacion?.stringValue ||
      new Date().toISOString(),
  };
}

