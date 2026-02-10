import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =====================
// GET → Obtener todas las noticias
// =====================
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM noticias ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error obteniendo noticias", details: error.message },
      { status: 500 }
    );
  }
}

// =====================
// POST → Crear noticia
// =====================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, categoria, fecha, descripcion, contenido, imagen } = body;

    const [result]: any = await pool.execute(
      `INSERT INTO noticias (titulo, categoria, fecha, descripcion, contenido, imagen)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, categoria, fecha, descripcion, contenido, imagen]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        ...body,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error creando noticia", details: error.message },
      { status: 500 }
    );
  }
}
