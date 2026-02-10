// /app/api/programas/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ==============================
// GET → Listar programas
// ==============================
export async function GET() {
  try {
    const [rows]: any = await pool.execute("SELECT * FROM programas");

    // Convertir estado → activo (boolean)
    const programas = rows.map((p: any) => ({
      ...p,
      activo: p.estado === "activo",
    }));

    return NextResponse.json(programas);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error cargando programas", details: error.message },
      { status: 500 }
    );
  }
}

// ==============================
// POST → Crear programa
// ==============================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nombre,
      descripcion,
      objetivos,
      beneficiarios,
      presupuesto,
      responsable,
      activo,
    } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    const estado = activo ? "activo" : "inactivo";

    const [result]: any = await pool.execute(
      `INSERT INTO programas 
      (nombre, descripcion, objetivos, beneficiarios, presupuesto, responsable, estado, fecha_inicio)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        nombre,
        descripcion,
        objetivos,
        beneficiarios ?? 0,
        presupuesto ?? 0,
        responsable ?? null,
        estado,
      ]
    );

    return NextResponse.json(
      { success: true, id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear programa", details: error.message },
      { status: 500 }
    );
  }
}
