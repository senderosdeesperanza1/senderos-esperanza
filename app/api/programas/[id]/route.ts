// /app/api/programas/[id]/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ==============================
// GET → Obtener programa por ID
// ==============================
export async function GET(
  _: any,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.execute(
      "SELECT * FROM programas WHERE id = ?",
      [id],
    );

    if (rows.length === 0)
      return NextResponse.json(
        { error: "Programa no encontrado" },
        { status: 404 },
      );

    const programa = {
      ...rows[0],
      activo: rows[0].estado === "activo",
    };

    return NextResponse.json(programa);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error obteniendo programa", details: error.message },
      { status: 500 },
    );
  }
}

// ==============================
// PUT → Actualizar programa por ID
// ==============================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    const estado = activo ? "activo" : "inactivo";

    await pool.execute(
      `UPDATE programas SET
        nombre=?, descripcion=?, objetivos=?, beneficiarios=?, presupuesto=?, responsable=?, estado=?
      WHERE id=?`,
      [
        nombre,
        descripcion,
        objetivos,
        beneficiarios,
        presupuesto,
        responsable,
        estado,
        id,
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error actualizando programa", details: error.message },
      { status: 500 },
    );
  }
}

// ==============================
// DELETE → Eliminar programa
// ==============================
export async function DELETE(
  _: any,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await pool.execute("DELETE FROM programas WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error eliminando programa", details: error.message },
      { status: 500 },
    );
  }
}
