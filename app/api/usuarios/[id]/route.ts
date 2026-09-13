import { NextResponse } from "next/server";
import {
  firestoreDocumentToUsuario,
  firestoreRequest,
  usuarioToFirestoreFields,
} from "@/lib/firestore-rest";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const document = await firestoreRequest(`usuarios/${encodeURIComponent(id)}`);
    return NextResponse.json(firestoreDocumentToUsuario(document), { status: 200 });
  } catch (error: any) {
    const status = error?.status || 500;
    return NextResponse.json(
      { error: "Usuario no encontrado", details: error.message },
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
    const { nombre, email, rol, estado, password } = body;

    if (!nombre || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 },
      );
    }

    const currentDocument = await firestoreRequest(`usuarios/${encodeURIComponent(id)}`);
    const currentUser = firestoreDocumentToUsuario(currentDocument);

    const updateData = {
      uid: currentUser.uid,
      nombre: String(nombre).trim(),
      email: String(email).trim(),
      rol: rol || currentUser.rol,
      estado: estado || currentUser.estado,
      ultimoAcceso: currentUser.ultimoAcceso || new Date().toISOString(),
      fechaCreacion: currentUser.fechaCreacion,
    };

    if (password && String(password).trim() !== "") {
      // La contraseña no se almacena en Firestore; se usa solo como dato del formulario.
      // Si quieres actualizar el password de Firebase Auth, se debe hacer desde Admin SDK o un endpoint especializado.
    }

    const updatedDocument = await firestoreRequest(
      `usuarios/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          fields: usuarioToFirestoreFields(updateData),
        }),
      },
    );

    return NextResponse.json(firestoreDocumentToUsuario(updatedDocument), { status: 200 });
  } catch (error: any) {
    const status = error?.status || 500;
    return NextResponse.json(
      { error: "Error al actualizar usuario", details: error.message },
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

    await firestoreRequest(`usuarios/${encodeURIComponent(id)}`);
    await firestoreRequest(`usuarios/${encodeURIComponent(id)}`, { method: "DELETE" });

    return NextResponse.json(
      { success: true, message: "Usuario eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error: any) {
    const status = error?.status || 500;
    return NextResponse.json(
      { error: "Error al eliminar usuario", details: error.message },
      { status },
    );
  }
}
