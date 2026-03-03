import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// =========================
// GET: Obtener usuario por ID
// =========================
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const [rows]: any = await pool.execute(
      "SELECT * FROM usuarios WHERE id = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const u = rows[0];

    return NextResponse.json(
      {
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        rol: u.rol,
        estado: u.estado,
        ultimoAcceso: u.ultimo_acceso,
        fechaCreacion: u.fecha_creacion,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error interno", details: error.message },
      { status: 500 },
    );
  }
}

// =========================
// PUT: Actualizar usuario
// =========================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { nombre, email, rol, estado, password } = body;

    // Obtener usuario actual
    const [rows]: any = await pool.execute(
      "SELECT * FROM usuarios WHERE id = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const userActual = rows[0];

    // Conservar contraseña si viene vacía
    const newPassword =
      password && password.trim() !== "" ? password : userActual.password;

    // Actualizar usuario
    await pool.execute(
      `UPDATE usuarios 
        SET nombre = ?, email = ?, rol = ?, estado = ?, password = ?
        WHERE id = ?`,
      [nombre, email, rol, estado, newPassword, id],
    );

    // Después de actualizar, obtener el usuario actualizado para devolverlo
    const [updatedRows]: any = await pool.execute(
      "SELECT * FROM usuarios WHERE id = ? LIMIT 1",
      [id],
    );

    const updatedUser = updatedRows[0];

    return NextResponse.json(
      {
        id: updatedUser.id,
        nombre: updatedUser.nombre,
        email: updatedUser.email,
        rol: updatedUser.rol,
        estado: updatedUser.estado,
        ultimoAcceso: updatedUser.ultimo_acceso,
        fechaCreacion: updatedUser.fecha_creacion,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al actualizar usuario", details: error.message },
      { status: 500 },
    );
  }
}

// =========================
// DELETE: Eliminar usuario
// =========================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Verificar existencia
    const [rows]: any = await pool.execute(
      "SELECT id, rol FROM usuarios WHERE id = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const usuario = rows[0];

    // Evitar borrar último admin
    if (usuario.rol === "admin") {
      const [admins]: any = await pool.execute(
        "SELECT COUNT(*) AS total FROM usuarios WHERE rol = 'admin'",
      );
      if (admins[0].total <= 1) {
        return NextResponse.json(
          { error: "No se puede eliminar el último administrador" },
          { status: 400 },
        );
      }
    }

    // Eliminar
    await pool.execute("DELETE FROM usuarios WHERE id = ?", [id]);

    return NextResponse.json(
      { success: true, message: "Usuario eliminado exitosamente" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al eliminar usuario", details: error.message },
      { status: 500 },
    );
  }
}
