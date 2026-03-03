import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =============================
// GET voluntario por ID
// =============================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    const [rows]: any = await pool.execute(
      "SELECT * FROM voluntarios WHERE id = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Voluntario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error obteniendo voluntario", details: error.message },
      { status: 500 },
    );
  }
}

// =============================
// PUT actualizar voluntario
// =============================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    const body = await request.json();

    const [exists]: any = await pool.execute(
      "SELECT id FROM voluntarios WHERE id = ?",
      [id],
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { error: "Voluntario no encontrado" },
        { status: 404 },
      );
    }

    await pool.execute(
      `UPDATE voluntarios SET
       nombre = ?, apellido = ?, email = ?, telefono = ?,
       fecha_nacimiento = ?, profesion = ?, direccion = ?,
       disponibilidad = ?, programa = ?, estado = ?
       WHERE id = ?`,
      [
        body.nombre || body.nombres,
        body.apellido || body.apellidos,
        body.email,
        body.telefono,
        body.fecha_nacimiento || body.fechaNacimiento || null,
        body.profesion,
        body.direccion,
        body.disponibilidad,
        body.programa,
        body.estado,
        id,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Voluntario actualizado correctamente",
    });
  } catch (error: any) {
    // Fallback por si la validación de arriba falla (ej. race condition)
    // y la base de datos rechaza por una constraint UNIQUE.
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Ya existe un voluntario con esta cédula o email." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar voluntario", details: error.message },
      { status: 500 },
    );
  }
}

// =============================
// DELETE eliminar voluntario
// =============================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    const [exists]: any = await pool.execute(
      "SELECT id FROM voluntarios WHERE id = ?",
      [id],
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { error: "Voluntario no encontrado" },
        { status: 404 },
      );
    }

    await pool.execute("DELETE FROM voluntarios WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Voluntario eliminado correctamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar voluntario", details: error.message },
      { status: 500 },
    );
  }
}
