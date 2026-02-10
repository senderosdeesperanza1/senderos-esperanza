import { type NextRequest, NextResponse } from "next/server"

// Configuración de Wompi
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY || "pub_test_your_public_key"
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY || "prv_test_your_private_key"
const WOMPI_API_URL = "https://production.wompi.co/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, customer_email, payment_method, customer_data, pse_data } = body

    console.log("[v0] Iniciando transacción Wompi:", { payment_method, amount })

    // Paso 1: Crear token de aceptación (requerido por Wompi)
    const acceptanceTokenResponse = await fetch(`${WOMPI_API_URL}/merchants/${WOMPI_PUBLIC_KEY}`, {
      method: "GET",
    })
    const merchantData = await acceptanceTokenResponse.json()
    const acceptanceToken = merchantData.data.presigned_acceptance.acceptance_token

    console.log("[v0] Token de aceptación obtenido")

    // Paso 2: Crear la transacción según el método de pago
    const transactionData: any = {
      acceptance_token: acceptanceToken,
      amount_in_cents: amount,
      currency: currency,
      customer_email: customer_email,
      reference: `DON-${Date.now()}`,
      redirect_url: `${process.env.APP_URL || "http://localhost:3000"}/donation-success`,
    }

    if (payment_method === "PSE") {
      transactionData.payment_method = {
        type: "PSE",
        user_type: pse_data.user_type,
        user_legal_id_type: "CC",
        user_legal_id: "123456789",
        financial_institution_code: pse_data.financial_institution_code,
        payment_description: `Donación a Senderos de Esperanza`,
      }
    } else if (payment_method === "NEQUI") {
      transactionData.payment_method = {
        type: "NEQUI",
        phone_number: customer_data.phone_number,
      }
    } else if (payment_method === "DAVIPLATA") {
      transactionData.payment_method = {
        type: "BANCOLOMBIA_TRANSFER",
        phone_number: customer_data.phone_number,
      }
    }

    console.log("[v0] Creando transacción en Wompi")

    // Crear la transacción en Wompi
    const transactionResponse = await fetch(`${WOMPI_API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
      },
      body: JSON.stringify(transactionData),
    })

    const transactionResult = await transactionResponse.json()

    console.log("[v0] Respuesta de Wompi:", transactionResult)

    if (transactionResult.data) {
      return NextResponse.json({
        success: true,
        transaction_id: transactionResult.data.id,
        payment_url: transactionResult.data.payment_method?.extra?.async_payment_url || null,
        status: transactionResult.data.status,
      })
    } else {
      console.error("[v0] Error en transacción:", transactionResult.error)
      return NextResponse.json(
        {
          success: false,
          error: transactionResult.error?.messages || "Error al crear la transacción",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Error en la transacción de Wompi:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
