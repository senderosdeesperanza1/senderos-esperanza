import { NextResponse } from "next/server";

const COOKIE_NAME = "token";
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIREBASE_SIGN_IN_URL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    if (!FIREBASE_API_KEY) {
      return NextResponse.json(
        { error: "Falta configurar NEXT_PUBLIC_FIREBASE_API_KEY" },
        { status: 500 }
      );
    }

    const firebaseResponse = await fetch(
      `${FIREBASE_SIGN_IN_URL}?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnSecureToken: true,
        }),
        cache: "no-store",
      }
    );

    const data = await firebaseResponse.json();

    if (!firebaseResponse.ok) {
      console.error("Firebase Auth:", data?.error?.message);
      return NextResponse.json(
        { error: "Correo o contraseña inválidos" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: data.localId,
        email: data.email,
        nombre: data.displayName || data.email,
      },
    });

    response.cookies.set(COOKIE_NAME, data.idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: Number(data.expiresIn) || 3600,
    });

    return response;
  } catch (error) {
    console.error("Error en Firebase Auth:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}