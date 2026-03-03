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
      { status: 500 },
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
      nombre,
      apellido,
      cedula,
      email,
      telefono,
      fecha_nacimiento,
      profesion,
      direccion,
      disponibilidad,
      programa,
      estado,
    } = body;

    // Validación mínima
    if (!nombre || !apellido || !cedula || !email) {
      return NextResponse.json(
        { error: "Nombres, apellidos, cédula y email son obligatorios" },
        { status: 400 },
      );
    }

    // Solución Profesional: Validar longitud de la cédula
    if (cedula.length < 7 || cedula.length > 10) {
      return NextResponse.json(
        { error: "La cédula debe tener entre 7 y 10 dígitos." },
        { status: 400 },
      );
    }

    // Solución Profesional: Validar que la cédula sea única antes de insertar
    const [existing]: any = await pool.execute(
      "SELECT id FROM voluntarios WHERE cedula = ?",
      [cedula],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Ya existe un voluntario registrado con esta cédula." },
        { status: 409 }, // 409 Conflict
      );
    }

    const [result]: any = await pool.execute(
      `INSERT INTO voluntarios 
      (nombre, apellido, cedula, email, telefono, fecha_nacimiento, profesion, direccion, disponibilidad, programa, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        cedula,
        email,
        telefono,
        fecha_nacimiento,
        profesion,
        direccion,
        disponibilidad,
        programa,
        estado || "activo",
      ],
    );

    return NextResponse.json(
      { success: true, id: result.insertId },
      { status: 201 },
    );
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
      { error: "Error al crear voluntario", details: error.message },
      { status: 500 },
    );
  }
}
