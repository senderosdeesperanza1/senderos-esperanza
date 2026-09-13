import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Firebase maneja la sesión del lado del cliente
    // Esta ruta simplemente confirma el logout
    
    const response = NextResponse.json(
      { 
        success: true,
        message: "Sesión cerrada correctamente"
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
