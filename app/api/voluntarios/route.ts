// /app/api/voluntarios/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ========================================
// GET → Obtener todos los voluntarios
// ========================================
export async function GET() {
  try {
    // Solución Profesional: Usar pool.query y LEFT JOIN para obtener el nombre del programa.
    const [rows]: any = await pool.query(`
      SELECT 
        v.*, 
        p.nombre AS programaNombre 
      FROM 
        voluntarios v
      LEFT JOIN 
        programas p ON v.programa = p.id
      ORDER BY v.id DESC`);

    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener voluntarios", details: error.message },
      { status: 500 }
    );
  }
}

// ========================================
// POST → Crear nuevo voluntario
// ========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombres,
      apellidos,
      cedula,
      email,
      telefono,
      fechaNacimiento,
      profesion,
      direccion,
      disponibilidad,
      programaId,
      estado,
    } = body;

    // Validación mínima
    if (!nombres || !apellidos || !cedula || !email) {
      return NextResponse.json(
        { error: "Nombres, apellidos, cédula y email son obligatorios" },
        { status: 400 }
      );
    }

    const [result]: any = await pool.execute(
      `INSERT INTO voluntarios 
      (nombre, apellido, cedula, email, telefono, fecha_nacimiento, profesion, direccion, disponibilidad, programa, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombres,
        apellidos,
        cedula,
        email,
        telefono,
        fechaNacimiento || null,
        profesion,
        direccion,
        disponibilidad,
        programaId || null,
        estado || "activo",
      ]
    );

    return NextResponse.json(
      { success: true, id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear voluntario", details: error.message },
      { status: 500 }
    );
  }
}
