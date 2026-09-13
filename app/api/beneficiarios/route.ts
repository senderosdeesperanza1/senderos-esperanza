import { NextResponse } from "next/server";
import {
  firestoreRequest,
  type FirestoreDocument,
} from "@/lib/firestore-rest";

function toFirestoreText(value: unknown) {
  return typeof value === "string" ? value : value === undefined || value === null ? "" : String(value);
}

function toFirestoreFields(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, { stringValue: toFirestoreText(value) }]),
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

export async function GET() {
  try {
    const data = (await firestoreRequest("beneficiarios")) as {
      documents?: FirestoreDocument[];
    };

    const beneficiarios = Array.isArray(data?.documents)
      ? data.documents.map(documentToBeneficiario)
      : [];

    return NextResponse.json(beneficiarios, { status: 200 });
  } catch (error: any) {
    console.error("GET beneficiarios error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombres,
      apellidos,
      fechaNacimiento,
      edad,
      cedula,
      genero,
      direccion,
      barrio,
      nombreAcudiente,
      telefonoAcudiente,
      emailAcudiente,
      estado = "activo",
    } = body;

    const document = await firestoreRequest("beneficiarios", {
      method: "POST",
      body: JSON.stringify({
        fields: toFirestoreFields({
          nombres: String(nombres || "").trim(),
          apellidos: String(apellidos || "").trim(),
          fechaNacimiento: String(fechaNacimiento || ""),
          edad: Number(edad || 0),
          cedula: String(cedula || "").trim(),
          genero: String(genero || ""),
          direccion: String(direccion || ""),
          barrio: String(barrio || ""),
          nombreAcudiente: String(nombreAcudiente || "").trim(),
          telefonoAcudiente: String(telefonoAcudiente || "").trim(),
          emailAcudiente: String(emailAcudiente || "").trim(),
          estado: String(estado || "activo"),
          fechaIngreso: new Date().toISOString(),
        }),
      }),
    });

    return NextResponse.json(documentToBeneficiario(document as FirestoreDocument), { status: 201 });
  } catch (error: any) {
    console.error("POST beneficiario error:", error);
    return NextResponse.json(
      { error: "Error al crear beneficiario", details: error.message },
      { status: 500 },
    );
  }
}
