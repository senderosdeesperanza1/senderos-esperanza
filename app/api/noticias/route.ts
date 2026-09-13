import { NextResponse } from "next/server";
import {
  FirestoreRequestError,
  firestoreDocumentToNoticia,
  firestoreRequest,
  noticiaToFirestoreFields,
  type NoticiaData,
} from "@/lib/firestore-rest";

function validarNoticia(body: unknown): NoticiaData | null {
  if (!body || typeof body !== "object") return null;
  const noticia = body as Record<string, unknown>;
  const campos = ["titulo", "categoria", "fecha", "descripcion"] as const;
  if (campos.some((campo) => typeof noticia[campo] !== "string" || !noticia[campo].trim())) return null;
  return {
    titulo: noticia.titulo as string,
    categoria: noticia.categoria as string,
    fecha: noticia.fecha as string,
    descripcion: noticia.descripcion as string,
    contenido: typeof noticia.contenido === "string" ? noticia.contenido.trim() : "",
    imagen: typeof noticia.imagen === "string" ? noticia.imagen.trim() : "",
  };
}

function errorResponse(error: unknown, fallback: string) {
  const details = error instanceof Error ? error.message : "Error desconocido";
  const status = error instanceof FirestoreRequestError ? error.status : 500;
  return NextResponse.json({ error: fallback, details }, { status });
}

export async function GET() {
  try {
    const data = (await firestoreRequest("noticias?orderBy=fecha%20desc")) as {
      documents?: Parameters<typeof firestoreDocumentToNoticia>[0][];
    };
    return NextResponse.json((data.documents || []).map(firestoreDocumentToNoticia));
  } catch (error) {
    console.error("GET noticias error:", error);
    return errorResponse(error, "Error obteniendo noticias");
  }
}

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  try {
    const noticia = validarNoticia(await request.json());
    if (!noticia) {
      return NextResponse.json({ error: "Título, categoría, fecha y descripción son obligatorios" }, { status: 400 });
    }
    const document = await firestoreRequest(
      "noticias",
      {
        method: "POST",
        body: JSON.stringify({ fields: noticiaToFirestoreFields(noticia) }),
      },
      getBearerToken(request),
    );
    return NextResponse.json(firestoreDocumentToNoticia(document), { status: 201 });
  } catch (error) {
    console.error("POST noticias error:", error);
    return errorResponse(error, "Error creando noticia");
  }
}
