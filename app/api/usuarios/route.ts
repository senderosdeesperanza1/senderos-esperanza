import { NextResponse } from "next/server";
import {
  firestoreDocumentToUsuario,
  firestoreRequest,
  type FirestoreDocument,
  usuarioToFirestoreFields,
} from "@/lib/firestore-rest";

export async function GET() {
  try {
    const data = (await firestoreRequest("usuarios?orderBy=fechaCreacion%20desc")) as {
      documents?: FirestoreDocument[];
    };

    const usuarios = Array.isArray(data?.documents)
      ? data.documents.map((doc) => firestoreDocumentToUsuario(doc))
      : [];

    return NextResponse.json(usuarios, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error al obtener usuarios desde Firebase:", error.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password, rol, estado } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!firebaseApiKey) {
      return NextResponse.json(
        { error: "Falta configurar NEXT_PUBLIC_FIREBASE_API_KEY" },
        { status: 500 },
      );
    }

    const authResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(email).trim(),
          password,
          returnSecureToken: true,
        }),
        cache: "no-store",
      },
    );

    const authData = await authResponse.json();

    if (!authResponse.ok) {
      return NextResponse.json(
        {
          error: authData?.error?.message || "No se pudo crear la cuenta en Firebase",
        },
        { status: 400 },
      );
    }

    const fechaCreacion = new Date().toISOString();
    const document = (await firestoreRequest("usuarios", {
      method: "POST",
      body: JSON.stringify({
        fields: usuarioToFirestoreFields({
          uid: authData.localId,
          nombre: String(nombre).trim(),
          email: String(email).trim(),
          rol: rol || "coordinador",
          estado: estado || "activo",
          ultimoAcceso: "",
          fechaCreacion,
        }),
      }),
    })) as FirestoreDocument;

    return NextResponse.json(firestoreDocumentToUsuario(document), { status: 201 });
  } catch (error: any) {
    console.error("❌ Error al crear usuario:", error.message);
    return NextResponse.json(
      {
        error: "Error al crear usuario",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
