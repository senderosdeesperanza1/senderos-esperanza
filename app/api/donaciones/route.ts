import { NextResponse } from "next/server";

// GET - Obtener donaciones
export async function GET() {
  try {
    // Datos de ejemplo
    const donaciones = [
      {
        id: "1",
        nombre: "Juan Pérez",
        email: "juan@example.com",
        monto: 50000,
        metodo: "Transferencia",
        estado: "completado",
        mensaje: "Para el programa de educación",
        fecha: new Date().toISOString(),
      },
      {
        id: "2",
        nombre: "María González",
        email: "maria@example.com",
        monto: 100000,
        metodo: "Tarjeta",
        estado: "completado",
        mensaje: "Apoyo a programas de salud",
        fecha: new Date().toISOString(),
      },
      {
        id: "3",
        nombre: "Carlos López",
        email: "carlos@example.com",
        monto: 30000,
        metodo: "PSE",
        estado: "completado",
        mensaje: "Para nutrición infantil",
        fecha: new Date().toISOString(),
      },
    ];
    
    return NextResponse.json(donaciones);
  } catch (error: any) {
    console.error("GET donaciones error:", error);
    return NextResponse.json(
      { error: "Error al cargar donaciones", details: error.message },
      { status: 500 }
    );
  }
}

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
