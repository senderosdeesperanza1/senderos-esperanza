import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("📥 Ingreso a POST /beneficiarios/[id]/archivos");

  const params = await context.params;
  const beneficiarioId = params.id;

  if (!beneficiarioId) {
    return NextResponse.json(
      { error: "ID de beneficiario no recibido en la URL" },
      { status: 400 }
    );
  }

  const { nombre, archivo, tipo, size } = await request.json();

  if (!archivo || !archivo.startsWith("data:")) {
    return NextResponse.json(
      { error: "Archivo base64 inválido" },
      { status: 400 }
    );
  }

  try {
    // 1. Convertir base64 a un buffer
    const base64Data = archivo.split(";base64,").pop();
    if (!base64Data) {
      throw new Error("Contenido base64 no válido");
    }
    const buffer = Buffer.from(base64Data, "base64");

    // 2. Crear un nombre de archivo único y definir la ruta de guardado
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${nombre}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const relativePath = `/uploads/${filename}`; // Ruta que se guardará en la BD

    // Asegurarse de que el directorio de subida existe
    await fs.mkdir(uploadDir, { recursive: true });

    // 3. Guardar el archivo en el sistema de ficheros
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    console.log(`✅ Archivo guardado en: ${relativePath}`);

    // 4. Guardar solo los metadatos y la ruta en la base de datos
    const [result]: any = await pool.query(
      `INSERT INTO archivos (beneficiario_id, nombre, tipo, ruta_archivo, fecha)
       VALUES (?, ?, ?, ?, NOW())`,
      [beneficiarioId, nombre, tipo, relativePath]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        nombre,
        tipo,
        ruta: relativePath,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Error al guardar archivo:", err);
    return NextResponse.json(
      { error: "Error al guardar archivo", details: err.message },
      { status: 500 }
    );
  }
}
