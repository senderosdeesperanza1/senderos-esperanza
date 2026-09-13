import { NextResponse } from "next/server";
import { firestoreRequest, type FirestoreDocument } from "@/lib/firestore-rest";

const fallbackProgramas = [
  { id: "educacion", nombre: "Educación" },
  { id: "salud", nombre: "Salud" },
  { id: "bienestar", nombre: "Bienestar" },
  { id: "alimentos", nombre: "Alimentos" },
  { id: "otro", nombre: "Otro" },
];

function documentToPrograma(document: FirestoreDocument) {
  const fields = document.fields || {};
  return {
    id: document.name.split("/").pop() || "",
    nombre: fields.nombre?.stringValue || fields.titulo?.stringValue || "",
  };
}

export async function GET() {
  try {
    const data = (await firestoreRequest("programas")) as {
      documents?: FirestoreDocument[];
    };

    const programas = Array.isArray(data?.documents)
      ? data.documents.map(documentToPrograma)
      : fallbackProgramas;

    return NextResponse.json(programas.length ? programas : fallbackProgramas, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error al cargar programas desde Firebase:", error?.message || error);
    return NextResponse.json(fallbackProgramas, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nombre = String(body?.nombre || "").trim();

    if (!nombre) {
      return NextResponse.json({ error: "El nombre del programa es obligatorio" }, { status: 400 });
    }

    const document = await firestoreRequest("programas", {
      method: "POST",
      body: JSON.stringify({
        fields: {
          nombre: { stringValue: nombre },
        },
      }),
    });

    return NextResponse.json(documentToPrograma(document as FirestoreDocument), { status: 201 });
  } catch (error: any) {
    console.error("Error al crear programa:", error?.message || error);
    return NextResponse.json(
      { error: "Error al crear programa", details: error?.message || "Desconocido" },
      { status: 500 },
    );
  }
}
