import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getSQLDateTime } from "@/lib/db";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const JWT_SECRET = process.env.JWT_SECRET || "CLAVE_SECRETA_SUPER_SEGURA";
const JWT_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 días en segundos

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("🔹 Email recibido:", email);
    console.log("🔹 Password recibido:", password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // BUSCAR USUARIO
    const [rows]: any = await pool.execute(
      "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // VERIFICAR CONTRASEÑA (sin encriptar)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // ACTUALIZAR ÚLTIMO ACCESO
    const fechaSQL = getSQLDateTime();

    await pool.execute("UPDATE usuarios SET ultimo_acceso = ? WHERE id = ?", [
      fechaSQL,
      user.id,
    ]);

    // CREAR TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    console.log("🔐 Token generado:", token);

    // RESPUESTA + COOKIE HTTP ONLY
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        ultimo_acceso: fechaSQL,
      },
    });

    // Setear cookie segura
    res.headers.set(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Max-Age=${JWT_EXPIRES_IN}; SameSite=Lax; Secure=${
        process.env.NODE_ENV === "production" ? "true" : "false"
      }`
    );

    return res;
  } catch (error) {
    console.error("🔥 ERROR LOGIN:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
