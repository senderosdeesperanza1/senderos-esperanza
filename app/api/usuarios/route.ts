import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =====================================
// GET — Obtener todos los usuarios (MySQL)
// =====================================
export async function GET() {
  try {
    const [rows] = await pool.execute<any[]>(
      "SELECT id, nombre, email, rol, estado, ultimo_acceso, fecha_creacion FROM usuarios"
    );

    // Transforma snake_case a camelCase para que coincida con el frontend
    const usuarios = rows.map((row) => ({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      rol: row.rol,
      estado: row.estado,
      ultimoAcceso: row.ultimo_acceso,
      fechaCreacion: row.fecha_creacion,
    }));

    return NextResponse.json(usuarios, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios:", error.message);
    return NextResponse.json(
      {
        error: "Error al obtener usuarios",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// =====================================
// POST — Crear usuario (MySQL)
// =====================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password, rol, estado } = body;

    // VALIDACIONES
    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const [existe]: any = await pool.execute(
      "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (existe.length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    const fechaCreacion = new Date();

    // Insertar usuario
    const [result]: any = await pool.execute<any>(
      `INSERT INTO usuarios (nombre, email, password, rol, estado, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        email,
        password,
        rol || "coordinador",
        estado || "activo",
        fechaCreacion,
      ]
    );

    const nuevoUsuario = {
      id: result.insertId,
      nombre,
      email,
      rol: rol || "coordinador",
      estado: estado || "activo",
      fechaCreacion: fechaCreacion,
      ultimoAcceso: null,
    };

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error al crear usuario:", error.message);
    return NextResponse.json(
      {
        error: "Error al crear usuario",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
