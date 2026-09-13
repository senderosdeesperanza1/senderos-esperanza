import { NextResponse } from "next/server";
import {
  FirestoreRequestError,
  firestoreDocumentToGaleria,
  firestorePublicRequest,
  firestoreRequest,
  galeriaToFirestoreFields,
  type GaleriaData,
} from "@/lib/firestore-rest";

function validarGaleria(body: unknown): GaleriaData | null {
  if (!body || typeof body !== "object") return null;
  const item = body as Record<string, unknown>;
  if (!item.imagen || typeof item.imagen !== "string" || !item.imagen.trim()) {
    return null;
  }
  return {
    imagen: item.imagen.trim(),
    fecha: typeof item.fecha === "string" && item.fecha.trim() ? item.fecha.trim() : new Date().toISOString().slice(0, 10),
  };
}

function errorResponse(error: unknown, fallback: string) {
  const details = error instanceof Error ? error.message : "Error desconocido";
  const status = error instanceof FirestoreRequestError ? error.status : 500;
  return NextResponse.json({ error: fallback, details }, { status });
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function getDocument(id: string) {
  return firestorePublicRequest(`galeria/${encodeURIComponent(id)}`);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json(firestoreDocumentToGaleria(await getDocument(id)));
  } catch (error) {
    return errorResponse(error, "Error obteniendo foto de galería");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = validarGaleria(await request.json());
    if (!item) {
      return NextResponse.json({ error: "La URL o archivo de la imagen es obligatoria" }, { status: 400 });
    }
    const authToken = getBearerToken(request);
    const document = await firestoreRequest(
      `galeria/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ fields: galeriaToFirestoreFields(item) }),
      },
      authToken,
    );
    return NextResponse.json(firestoreDocumentToGaleria(document));
  } catch (error) {
    return errorResponse(error, "Error al actualizar foto de galería");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authToken = getBearerToken(request);
    await firestoreRequest(
      `galeria/${encodeURIComponent(id)}`,
      { method: "DELETE" },
      authToken,
    );
    return NextResponse.json({ success: true, id });
  } catch (error) {
    return errorResponse(error, "Error al eliminar foto de galería");
  }
}
