import { NextResponse } from "next/server";

// GET - Obtener todas las donaciones

// POST - Crear nueva donación
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const nuevaDonacion = {
      id: Date.now().toString(),
      ...body,
      fecha: new Date().toISOString(),
    };

    return NextResponse.json(nuevaDonacion);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear donación" },
      { status: 500 }
    );
  }
}
