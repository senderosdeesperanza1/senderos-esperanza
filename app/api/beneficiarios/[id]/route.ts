// app/api/beneficiarios/[id]/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const [rows]: any = await pool.query(
      `SELECT * FROM beneficiarios WHERE id = ?`,
      [id],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    const b = rows[0];

    const [archivos]: any = await pool.query(
      `SELECT id, nombre, archivo, tipo, fecha_subida FROM archivos WHERE beneficiario_id = ? ORDER BY fecha_subida DESC`,
      [id],
    );

    const beneficiario = {
      id: b.id,
      nombres: b.nombres,
      apellidos: b.apellidos,
      fechaNacimiento: b.fecha_nacimiento?.toISOString().split("T")[0] || "",
      edad: b.edad,
      cedula: b.cedula || "",
      genero: b.genero,
      direccion: b.direccion,
      barrio: b.barrio || "",
      nombreAcudiente: b.nombre_acudiente,
      telefonoAcudiente: b.telefono_acudiente,
      emailAcudiente: b.email_acudiente || "",
      estado: b.estado || "Activo",
      archivos: archivos.map((a: any) => ({
        id: a.id,
        nombre: a.nombre,
        archivo: a.archivo,
        tipo: a.tipo,
        fechaSubida: a.fecha_subida,
      })),
    };

    return NextResponse.json(beneficiario);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const calcularEdad = (fecha: string) => {
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
      return edad;
    };

    const edad = body.fechaNacimiento ? calcularEdad(body.fechaNacimiento) : 0;

    await pool.query(
      `UPDATE beneficiarios SET 
        nombres=?, apellidos=?, fecha_nacimiento=?, edad=?, cedula=?, genero=?,
        direccion=?, barrio=?, nombre_acudiente=?, telefono_acudiente=?, email_acudiente=?, estado=?
       WHERE id=?`,
      [
        body.nombres,
        body.apellidos,
        body.fechaNacimiento,
        edad,
        body.cedula || null,
        body.genero,
        body.direccion,
        body.barrio || null,
        body.nombreAcudiente,
        body.telefonoAcudiente,
        body.emailAcudiente || null,
        body.estado || "Activo",
        id,
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const client = await pool.getConnection();
  try {
    const { id } = await params;
    await client.beginTransaction();

    await client.query(`DELETE FROM archivos WHERE beneficiario_id = ?`, [id]);
    await client.query(`DELETE FROM beneficiarios WHERE id = ?`, [id]);

    await client.commit();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    await client.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
