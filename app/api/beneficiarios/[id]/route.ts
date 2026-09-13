// app/api/beneficiarios/[id]/route.ts
import { NextResponse } from "next/server";
import { firestoreRequest, type FirestoreDocument } from "@/lib/firestore-rest";

function toFirestoreFields(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, { stringValue: value === undefined || value === null ? "" : String(value) }]),
  );
}

function documentToBeneficiario(document: FirestoreDocument) {
  const fields = document.fields || {};
  return {
    id: document.name.split("/").pop() || "",
    nombres: fields.nombres?.stringValue || "",
    apellidos: fields.apellidos?.stringValue || "",
    fechaNacimiento: fields.fechaNacimiento?.stringValue || fields.fecha_nacimiento?.stringValue || "",
    edad: Number(fields.edad?.stringValue || 0),
    cedula: fields.cedula?.stringValue || "",
    genero: fields.genero?.stringValue || "",
    direccion: fields.direccion?.stringValue || "",
    barrio: fields.barrio?.stringValue || "",
    nombreAcudiente: fields.nombreAcudiente?.stringValue || fields.nombre_acudiente?.stringValue || "",
    telefonoAcudiente: fields.telefonoAcudiente?.stringValue || fields.telefono_acudiente?.stringValue || "",
    emailAcudiente: fields.emailAcudiente?.stringValue || fields.email_acudiente?.stringValue || "",
    estado: fields.estado?.stringValue || "activo",
    fechaIngreso: fields.fechaIngreso?.stringValue || fields.fecha_ingreso?.stringValue || new Date().toISOString(),
    archivos: [],
  };
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const document = await firestoreRequest(`beneficiarios/${encodeURIComponent(id)}`);
    return NextResponse.json(documentToBeneficiario(document as FirestoreDocument), { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Beneficiario no encontrado", details: error.message }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const document = await firestoreRequest(`beneficiarios/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        fields: toFirestoreFields({
          nombres: body.nombres || "",
          apellidos: body.apellidos || "",
          fechaNacimiento: body.fechaNacimiento || "",
          edad: Number(body.edad || 0),
          cedula: body.cedula || "",
          genero: body.genero || "",
          direccion: body.direccion || "",
          barrio: body.barrio || "",
          nombreAcudiente: body.nombreAcudiente || "",
          telefonoAcudiente: body.telefonoAcudiente || "",
          emailAcudiente: body.emailAcudiente || "",
          estado: body.estado || "activo",
          fechaIngreso: body.fechaIngreso || new Date().toISOString(),
        }),
      }),
    });

    return NextResponse.json(documentToBeneficiario(document as FirestoreDocument), { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar beneficiario", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await firestoreRequest(`beneficiarios/${encodeURIComponent(id)}`, { method: "DELETE" });
    return NextResponse.json({ success: true, message: "Beneficiario eliminado correctamente" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al eliminar beneficiario", details: error.message }, { status: 500 });
  }
}
