import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  const beneficiarioId = params.id;

  if (!beneficiarioId) {
    return NextResponse.json(
      { error: "ID de beneficiario no recibido en la URL" },
      { status: 400 },
    );
  }

  try {
    const { nombre, archivo, tipo } = await request.json();

    if (!archivo || !String(archivo).startsWith("data:")) {
      return NextResponse.json(
        { error: "Archivo base64 inválido" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        id: `temp-${Date.now()}`,
        nombre: nombre || "archivo",
        tipo: tipo || "documento",
        ruta: String(archivo),
        beneficiarioId,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al guardar archivo", details: error.message },
      { status: 500 },
    );
  }
}
