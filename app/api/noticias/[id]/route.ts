import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ========================
// GET → Obtener noticia por ID
// ========================
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [rows]: any = await pool.execute(
      "SELECT * FROM noticias WHERE id = ? LIMIT 1",
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error obteniendo noticia", details: error.message },
      { status: 500 }
    );
  }
}

// ========================
// PUT → Actualizar noticia
// ========================
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { titulo, categoria, fecha, descripcion, contenido, imagen } = body;

    const [exists]: any = await pool.execute(
      "SELECT id FROM noticias WHERE id = ?",
      [params.id]
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    await pool.execute(
      `UPDATE noticias 
       SET titulo = ?, categoria = ?, fecha = ?, descripcion = ?, contenido = ?, imagen = ?
       WHERE id = ?`,
      [titulo, categoria, fecha, descripcion, contenido, imagen, params.id]
    );

    return NextResponse.json({ message: "Noticia actualizada correctamente" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error actualizando noticia", details: error.message },
      { status: 500 }
    );
  }
}

// ========================
// DELETE → Eliminar noticia
// ========================
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [exists]: any = await pool.execute(
      "SELECT id FROM noticias WHERE id = ?",
      [params.id]
    );

    if (exists.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    await pool.execute("DELETE FROM noticias WHERE id = ?", [params.id]);

    return NextResponse.json({ message: "Noticia eliminada correctamente" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error eliminando noticia", details: error.message },
      { status: 500 }
    );
  }
}
