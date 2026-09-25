// functions/api/donaciones.ts  ->  responde en  POST /api/donaciones
// Cloudflare Pages Function: crea un link de pago en Bold y devuelve { url } para redirigir al checkout.
//
// Variable de entorno (Cloudflare > Workers & Pages > tu proyecto > Settings > Variables):
//   BOLD_API_KEY   llave de identidad de Bold (márcala como "Secret")
//
// Documentación: https://developers.bold.co/pagos-en-linea/api-link-de-pagos

interface Env {
  BOLD_API_KEY?: string;
}

const MONTO_MINIMO = 5000;
const MONTO_MAXIMO = 20000000;
const HORAS_VIGENCIA = 24;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (!env.BOLD_API_KEY) {
    return json({ error: "El pago en línea aún no está configurado." }, 500);
  }

  let datos: Record<string, unknown>;
  try {
    datos = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Solicitud inválida." }, 400);
  }

  const monto = Number(datos.monto);
  const nombre = String(datos.nombre ?? "").trim();
  const correo = String(datos.correo ?? "").trim();

  if (!Number.isInteger(monto) || monto < MONTO_MINIMO || monto > MONTO_MAXIMO) {
    return json({ error: "El valor del aporte no es válido." }, 400);
  }
  if (nombre.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || datos.acepta !== true) {
    return json({ error: "Revisa tus datos e inténtalo de nuevo." }, 400);
  }

  const origen = new URL(request.url).origin;
  const referencia = `DON-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  // Bold pide la expiración en nanosegundos; se arma como texto para no perder precisión.
  const expiracion = `${Date.now() + HORAS_VIGENCIA * 3600 * 1000}000000`;

  const cuerpo = JSON.stringify({
    amount_type: "CLOSE",
    amount: { currency: "COP", total_amount: monto, tip_amount: 0 },
    reference: referencia,
    description: "Donación Corporación Senderos de Esperanza",
    expiration_date: "__EXP__",
    payer_email: correo,
    callback_url: `${origen}/donar/gracias`,
  }).replace('"__EXP__"', expiracion);

  try {
    const res = await fetch("https://integrations.api.bold.co/online/link/v1", {
      method: "POST",
      headers: {
        Authorization: `x-api-key ${env.BOLD_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: cuerpo,
    });

    const respuesta = (await res.json().catch(() => ({}))) as {
      payload?: { url?: string };
      errors?: unknown[];
    };

    if (!res.ok || !respuesta.payload?.url) {
      console.error("Bold error", res.status, JSON.stringify(respuesta.errors ?? respuesta));
      return json({ error: "No pudimos iniciar tu donación. Inténtalo de nuevo en unos minutos." }, 502);
    }

    return json({ url: respuesta.payload.url });
  } catch {
    return json({ error: "No pudimos conectar con la pasarela de pagos." }, 502);
  }
}
