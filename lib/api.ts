// functions/api/reviews.ts  ->  responde en  GET /api/reviews
// Cloudflare Pages Function (funciona junto a tu sitio estático de Next.js)
//
// Variables de entorno (Cloudflare > Workers & Pages > tu proyecto > Settings > Variables):
//   GOOGLE_PLACES_API_KEY  (márcala como "Secret")
//   GOOGLE_PLACE_ID

interface Env {
  GOOGLE_PLACES_API_KEY?: string;
  GOOGLE_PLACE_ID?: string;
}

type GoogleReview = {
  name: string;
  rating: number;
  relativePublishTimeDescription: string;
  text?: { text: string };
  originalText?: { text: string };
  authorAttribution?: { displayName: string; photoUri?: string };
};

const json = (body: unknown, status = 200, cache = "no-store") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cache,
    },
  });

export async function onRequestGet(context: { env: Env }) {
  const { GOOGLE_PLACES_API_KEY: apiKey, GOOGLE_PLACE_ID: placeId } = context.env;

  if (!apiKey || !placeId) {
    return json({ error: "Faltan variables de entorno" }, 500);
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=es`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
      }
    );

    if (!response.ok) return json({ error: "Error consultando Google" }, 502);

    const place = (await response.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: GoogleReview[];
    };
    const reviews = place.reviews ?? [];

    // Google solo entrega hasta 5 reseñas y no da el desglose por estrellas:
    // se calcula con las reseñas recibidas.
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const s = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[s] += 1;
    });

    return json(
      {
        rating: place.rating ?? 0,
        total: place.userRatingCount ?? reviews.length,
        distribution,
        reviews: reviews.map((r) => ({
          id: r.name,
          author: r.authorAttribution?.displayName ?? "Usuario de Google",
          avatar: r.authorAttribution?.photoUri,
          rating: r.rating,
          date: r.relativePublishTimeDescription,
          text: r.text?.text ?? r.originalText?.text ?? "",
        })),
      },
      200,
      // Cache 1 h en el navegador y 24 h en Cloudflare: ahorra cuota de la API
      "public, max-age=300, s-maxage=3600"
    );
  } catch {
    return json({ error: "Error interno" }, 500);
  }
}