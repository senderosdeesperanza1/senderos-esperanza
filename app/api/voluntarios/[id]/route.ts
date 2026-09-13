import { NextResponse } from "next/server";
import {
  firestoreDocumentToVoluntario,
  firestoreRequest,
  voluntarioToFirestoreFields,
} from "@/lib/firestore-rest";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const document = await firestoreRequest(`voluntarios/${encodeURIComponent(id)}`);
    return NextResponse.json(firestoreDocumentToVoluntario(document), { status: 200 });
  } catch (error: any) {
    const status = error?.status || 500;
    return NextResponse.json(
      { error: "Voluntario no encontrado", details: error.message },
      { status },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const currentDocument = await firestoreRequest(`voluntarios/${encodeURIComponent(id)}`);
    const currentUser = firestoreDocumentToVoluntario(currentDocument);

    const updateData = {
      nombre: body.nombre ?? currentUser.nombre,
      apellido: body.apellido ?? currentUser.apellido,
      email: body.email ?? currentUser.email,
      telefono: body.telefono ?? currentUser.telefono,
      cedula: body.cedula ?? currentUser.cedula,
      direccion: body.direccion ?? currentUser.direccion,
      fecha_nacimiento: body.fecha_nacimiento ?? currentUser.fecha_nacimiento,
      profesion: body.profesion ?? currentUser.profesion,
      disponibilidad: body.disponibilidad ?? currentUser.disponibilidad,
      programa: body.programa ?? currentUser.programa,
      estado: body.estado ?? currentUser.estado,
      fecha_creacion: currentUser.fecha_creacion,
    };

    const updatedDocument = await firestoreRequest(
      `voluntarios/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fields: voluntarioToFirestoreFields(updateData),
        }),
      },
    );

    return NextResponse.json(firestoreDocumentToVoluntario(updatedDocument), { status: 200 });
  } catch (error: any) {
    const status = error?.status || 500;
    return NextResponse.json(
      { error: "Error al actualizar voluntario", details: error.message },
      { status },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await firestoreRequest(`voluntarios/${encodeURIComponent(id)}`);
    await firestoreRequest(`voluntarios/${encodeURIComponent(id)}`, { method: "DELETE" });

    return NextResponse.json(
      { success: true, message: "Voluntario eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.status || 500;
    return NextResponse.json(
      { error: "Error al eliminar voluntario", details: error.message },
      { status },
    );
  }
}
