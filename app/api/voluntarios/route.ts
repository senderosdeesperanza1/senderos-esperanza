import { NextResponse } from "next/server";
import {
  firestoreDocumentToVoluntario,
  firestoreRequest,
  type FirestoreDocument,
  voluntarioToFirestoreFields,
} from "@/lib/firestore-rest";

export async function GET() {
  try {
    const data = (await firestoreRequest("voluntarios?orderBy=fecha_creacion%20desc")) as {
      documents?: FirestoreDocument[];
    };

    const voluntarios = Array.isArray(data?.documents)
      ? data.documents.map((doc) => firestoreDocumentToVoluntario(doc))
      : [];

    return NextResponse.json(voluntarios, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error al obtener voluntarios desde Firebase:", error.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellido,
      cedula,
      email,
      telefono,
      fecha_nacimiento,
      profesion,
      direccion,
      disponibilidad,
      programa,
      estado,
    } = body;

    if (!nombre || !apellido || !cedula || !email) {
      return NextResponse.json(
        { error: "Nombres, apellidos, cédula y email son obligatorios" },
        { status: 400 },
      );
    }

    const fechaCreacion = new Date().toISOString();
    const document = (await firestoreRequest("voluntarios", {
      method: "POST",
      body: JSON.stringify({
        fields: voluntarioToFirestoreFields({
          nombre: String(nombre).trim(),
          apellido: String(apellido).trim(),
          cedula: String(cedula).trim(),
          email: String(email).trim(),
          telefono: telefono ? String(telefono).trim() : "",
          fecha_nacimiento: fecha_nacimiento ? String(fecha_nacimiento) : "",
          profesion: profesion ? String(profesion).trim() : "",
          direccion: direccion ? String(direccion).trim() : "",
          disponibilidad: disponibilidad ? String(disponibilidad).trim() : "",
          programa: programa ? String(programa) : "",
          estado: estado || "activo",
          fecha_creacion: fechaCreacion,
        }),
      }),
    })) as FirestoreDocument;

    return NextResponse.json(firestoreDocumentToVoluntario(document), { status: 201 });
  } catch (error: any) {
    console.error("❌ Error al crear voluntario:", error.message);
    return NextResponse.json(
      { error: "Error al crear voluntario", details: error.message },
      { status: 500 },
    );
  }
}
