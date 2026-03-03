import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =============================
// GET: Obtener noticia por ID
// =============================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Solución al error: Esperar la promesa params
    const { id: idParam } = await params;
    const id = Number(idParam);

    const [rows]: any = await pool.execute(
      "SELECT * FROM noticias WHERE id = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error obteniendo noticia", details: error.message },
      { status: 500 },
    );
  }
}

// =============================
// PUT: Actualizar noticia
// =============================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);
    const body = await request.json();

    // Verificar si existe la noticia
    const [exists]: any = await pool.execute(
      "SELECT id FROM noticias WHERE id = ?",
      [id],
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 },
      );
    }

    // Actualizar en base de datos
    await pool.execute(
      `UPDATE noticias SET
       titulo = ?, descripcion = ?, categoria = ?, fecha = ?,
       imagen = ?, contenido = ?
       WHERE id = ?`,
      [
        body.titulo,
        body.descripcion,
        body.categoria,
        body.fecha,
        body.imagen,
        body.contenido,
        id,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Noticia actualizada correctamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar noticia", details: error.message },
      { status: 500 },
    );
  }
}

// =============================
// DELETE: Eliminar noticia
// =============================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;
    const id = Number(idParam);

    // Verificar si existe
    const [exists]: any = await pool.execute(
      "SELECT id FROM noticias WHERE id = ?",
      [id],
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 },
      );
    }

    // Eliminar de la base de datos
    await pool.execute("DELETE FROM noticias WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Noticia eliminada correctamente",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar noticia", details: error.message },
      { status: 500 },
    );
  }
}
