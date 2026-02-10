import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Interfaz para mejorar el tipado y la autocompletación
interface Archivo {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  ruta?: string; // La ruta es opcional por si hay archivos antiguos sin ella
}

interface Beneficiario {
  id: number;
  nombres: string;
  apellidos: string;
  // ... otros campos que quieras tipar
  archivos: Archivo[];
}

// ============================================================
// GET → Listar todos los beneficiarios con sus archivos
// ============================================================
export async function GET() {
  try {
    // Solución Compatible: Dos consultas separadas para evitar el uso de JSON_ARRAYAGG.
    // 1. Obtener todos los beneficiarios.
    const [beneficiariosRows]: any = await pool.query(`
      SELECT * FROM beneficiarios ORDER BY id DESC
    `);

    // 2. Obtener todos los archivos.
    const [archivosRows]: any = await pool.query(`
      SELECT id, beneficiario_id, nombre, tipo, fecha, ruta_archivo 
      FROM archivos 
      ORDER BY id DESC
    `);

    // 3. Combinar los datos en JavaScript.
    const beneficiarios = beneficiariosRows.map((b: any) => {
      // Renombramos las claves para que coincidan con lo que espera el frontend (camelCase)
      return {
        id: b.id,
        nombres: b.nombres,
        apellidos: b.apellidos,
        fechaNacimiento: b.fecha_nacimiento,
        edad: b.edad,
        cedula: b.cedula,
        genero: b.genero,
        direccion: b.direccion,
        barrio: b.barrio,
        nombreAcudiente: b.nombre_acudiente,
        telefonoAcudiente: b.telefono_acudiente,
        emailAcudiente: b.email_acudiente,
        estado: b.estado,
        fechaIngreso: b.fecha_ingreso,
        archivos: archivosRows
          .filter((a: any) => a.beneficiario_id === b.id)
          .map((a: any) => ({
            id: a.id,
            nombre: a.nombre,
            tipo: a.tipo,
            fecha: a.fecha,
            ruta: a.ruta_archivo,
          })),
      };
    });

    return NextResponse.json(beneficiarios);
  } catch (error: any) {
    console.error("GET beneficiarios error:", error);
    return NextResponse.json(
      { error: "Error al cargar beneficiarios", details: error.message },
      { status: 500 },
    );
  }
}

// ============================================================
// POST → Crear beneficiario
// ============================================================
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nombres,
      apellidos,
      fechaNacimiento,
      edad,
      cedula,
      genero,
      direccion,
      barrio,
      nombreAcudiente,
      telefonoAcudiente,
      emailAcudiente,
      estado = "activo",
    } = body;

    const sql = `
      INSERT INTO beneficiarios 
      (nombres, apellidos, fecha_nacimiento, edad, cedula, genero, direccion, barrio,
       nombre_acudiente, telefono_acudiente, email_acudiente, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result]: any = await pool.execute(sql, [
      nombres,
      apellidos,
      fechaNacimiento,
      edad,
      cedula,
      genero,
      direccion,
      barrio,
      nombreAcudiente,
      telefonoAcudiente,
      emailAcudiente,
      estado,
    ]);

    return NextResponse.json({
      success: true,
      id: result.insertId,
      message: "Beneficiario creado correctamente",
    });
  } catch (error: any) {
    console.error("POST beneficiario error:", error);
    return NextResponse.json(
      { error: "Error al crear beneficiario", details: error.message },
      { status: 500 },
    );
  }
}
