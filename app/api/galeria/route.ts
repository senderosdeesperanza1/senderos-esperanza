import { NextResponse } from "next/server";
import {
  FirestoreRequestError,
  firestoreDocumentToGaleria,
  firestorePublicRequest,
  firestoreRequest,
  galeriaToFirestoreFields,
  type GaleriaData,
} from "@/lib/firestore-rest";


export const DEFAULT_GALERIA_PHOTOS: (GaleriaData & { id: string })[] = [
];

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const allowFallback = url.searchParams.get("fallback") !== "false";

    const data = (await firestorePublicRequest("galeria")) as {
      documents?: Parameters<typeof firestoreDocumentToGaleria>[0][];
    };

    const documents = (data.documents || []).map(firestoreDocumentToGaleria);

    // If Firestore has documents, return them sorted by date descending
    if (documents.length > 0) {
      const sorted = documents.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));
      return NextResponse.json(sorted);
    }

    // If empty and fallback allowed, return default photos
    if (allowFallback) {
      return NextResponse.json(DEFAULT_GALERIA_PHOTOS);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("GET galeria error:", error);
    try {
      const url = new URL(request.url);
      if (url.searchParams.get("fallback") !== "false") {
        return NextResponse.json(DEFAULT_GALERIA_PHOTOS);
      }
    } catch {
      return NextResponse.json(DEFAULT_GALERIA_PHOTOS);
    }
    return errorResponse(error, "Error obteniendo fotos de galería");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a seed request to populate defaults into Firestore
    if (body && body.action === "seed") {
      const results = [];
      for (const item of DEFAULT_GALERIA_PHOTOS) {
        const { id, ...dataToSave } = item;
        const document = await firestoreRequest("galeria", {
          method: "POST",
          body: JSON.stringify({ fields: galeriaToFirestoreFields(dataToSave) }),
        });
        results.push(firestoreDocumentToGaleria(document));
      }
      return NextResponse.json({ success: true, count: results.length, items: results }, { status: 201 });
    }

    const item = validarGaleria(body);
    if (!item) {
      return NextResponse.json(
        { error: "La URL o archivo de la imagen es obligatoria" },
        { status: 400 }
      );
    }

    const document = await firestoreRequest("galeria", {
      method: "POST",
      body: JSON.stringify({ fields: galeriaToFirestoreFields(item) }),
    });

    return NextResponse.json(firestoreDocumentToGaleria(document), { status: 201 });
  } catch (error) {
    console.error("POST galeria error:", error);
    return errorResponse(error, "Error guardando foto en galería");
  }
}

