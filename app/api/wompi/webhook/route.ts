import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const WOMPI_EVENTS_KEY = process.env.WOMPI_EVENTS_KEY || "your_events_key"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get("x-event-checksum")

    // Verificar la firma del webhook
    const expectedSignature = crypto
      .createHash("sha256")
      .update(JSON.stringify(body) + WOMPI_EVENTS_KEY)
      .digest("hex")

    if (signature !== expectedSignature) {
      console.error("[v0] Firma de webhook inválida")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Procesar el evento
    const { event, data } = body

    console.log("[v0] Webhook recibido:", event, data)

    switch (event) {
      case "transaction.updated":
        // Aquí puedes actualizar el estado de la donación en tu base de datos
        console.log("[v0] Transacción actualizada:", data.transaction.id, data.transaction.status)

        if (data.transaction.status === "APPROVED") {
          // Donación aprobada - enviar email de confirmación, actualizar DB, etc.
          console.log("[v0] Donación aprobada:", data.transaction.reference)
        } else if (data.transaction.status === "DECLINED") {
          // Donación rechazada
          console.log("[v0] Donación rechazada:", data.transaction.reference)
        }
        break

      default:
        console.log("[v0] Evento no manejado:", event)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Error procesando webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
