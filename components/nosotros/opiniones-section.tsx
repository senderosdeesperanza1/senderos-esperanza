"use client";

import { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Star } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Configuración                                                       */
/* ------------------------------------------------------------------ */

const googleMapsUrl = "https://g.page/r/Ce1uoP2uMBrKECE/review";

// ID del widget de Elfsight "Google Reviews" (elfsight.com). Al pegarlo aquí, la página
// muestra TODAS las reseñas de Google. Es el texto que aparece en el código del widget:
// <div class="elfsight-app-XXXXXXXX-XXXX-...">  ->  pega solo lo que va después de "elfsight-app-".
// Si se deja vacío, se usa la versión propia de abajo (máximo 5 reseñas de Google).
const ELFSIGHT_WIDGET_ID = "";

// Endpoint de tu backend (ver api-reviews.ts). Si falla o no existe,
// el componente usa FALLBACK_DATA para que la sección nunca quede vacía.
const REVIEWS_ENDPOINT = "/api/reviews";

// Cuántas reseñas se ven al inicio; el resto aparece con "Ver más reseñas".
const INITIAL_VISIBLE = 3;

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type StarValue = 1 | 2 | 3 | 4 | 5;

type Review = {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string; // Ej: "hace 2 semanas"
  role?: string;
};

type ReviewsData = {
  rating: number; // Promedio, ej: 4.9
  total: number; // Total de reseñas en Google
  // Cantidad de reseñas por estrellas. Google NO entrega este desglose por API,
  // así que se calcula con las reseñas recibidas o se define a mano.
  distribution?: Partial<Record<StarValue, number>>;
  reviews: Review[];
};

/* ------------------------------------------------------------------ */
/* Datos de respaldo (tus testimonios actuales, ahora con estrellas)   */
/* ------------------------------------------------------------------ */

const FALLBACK_DATA: ReviewsData = {
  rating: 5,
  total: 3,
  distribution: { 5: 3, 4: 0, 3: 0, 2: 0, 1: 0 },
  reviews: [
    {
      id: "1",
      author: "María Elena",
      role: "Madre de familia",
      rating: 5,
      date: "hace 1 mes",
      text: "Gracias a Senderos de Esperanza mi hija pudo seguir estudiando con apoyo y acompañamiento. Sentimos que ya no estamos solos.",
    },
    {
      id: "2",
      author: "Carlos Mendez",
      role: "Voluntario",
      rating: 5,
      date: "hace 2 meses",
      text: "Ver el impacto real en la comunidad me motivó a involucrarme más. Es una organización con corazón y compromiso real.",
    },
    {
      id: "3",
      author: "Diana Torres",
      role: "Docente comunitaria",
      rating: 5,
      date: "hace 3 meses",
      text: "El trabajo de la fundación aporta estructura, esperanza y herramientas para transformar la vida de los niños.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Piezas pequeñas                                                     */
/* ------------------------------------------------------------------ */

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${value.toFixed(1)} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={`${size} ${
            n <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src && !failed) {
    return (
      <NextImage
        src={src}
        alt=""
        width={44}
        height={44}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-11 w-11 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2e7d32] text-sm font-bold text-white"
    >
      {initials}
    </div>
  );
}

function RatingBar({
  stars,
  count,
  percent,
}: {
  stars: StarValue;
  count: number;
  percent: number;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex w-6 shrink-0 items-center justify-end gap-0.5 font-medium text-slate-700">
        {stars}
      </span>
      <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
      <div
        className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#e2efe3]"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${stars} estrellas: ${count} reseñas`}
      >
        <div
          className="h-full rounded-full bg-[#2e7d32] transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right tabular-nums text-slate-500">{count}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sección principal                                                   */
/* ------------------------------------------------------------------ */

function ElfsightWidget({ id }: { id: string }) {
  useEffect(() => {
    if (document.querySelector('script[src*="elfsight.com/platform/platform.js"]')) return;
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div className={`elfsight-app-${id}`} data-elfsight-app-lazy />;
}

export function OpinionesSection() {
  const [data, setData] = useState<ReviewsData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (ELFSIGHT_WIDGET_ID) return;
    const controller = new AbortController();

    fetch(REVIEWS_ENDPOINT, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las reseñas");
        return res.json() as Promise<ReviewsData>;
      })
      .then((json) => {
        if (json?.reviews?.length) setData(json);
      })
      .catch(() => {
        /* Se queda con FALLBACK_DATA */
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Desglose por estrellas: usa el de la API/manual o lo calcula con las reseñas
  const distribution = useMemo(() => {
    const base: Record<StarValue, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (data.distribution) {
      ([5, 4, 3, 2, 1] as StarValue[]).forEach((s) => {
        base[s] = data.distribution?.[s] ?? 0;
      });
    } else {
      data.reviews.forEach((r) => {
        const s = Math.min(5, Math.max(1, Math.round(r.rating))) as StarValue;
        base[s] += 1;
      });
    }
    return base;
  }, [data]);

  const distributionTotal = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;
  const visibleReviews = showAll ? data.reviews : data.reviews.slice(0, INITIAL_VISIBLE);
  const hasMore = data.reviews.length > INITIAL_VISIBLE;

  return (
    <section id="opiniones" className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2e7d32]">
            Opiniones
          </p>
          <h1 className="text-3xl font-bold text-[#1f2430] md:text-5xl">
            Historias que inspiran confianza
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Lo que dicen las personas que han sido parte de Senderos de Esperanza.
          </p>
        </div>

        {ELFSIGHT_WIDGET_ID ? (
          <div>
            <ElfsightWidget id={ELFSIGHT_WIDGET_ID} />
            <div className="mt-8 text-center">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2e7d32] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#236126]"
              >
                Califícanos en Google
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
          {/* Resumen con barras de progreso */}
          <Card className="border-0 bg-[#f8fbf8] shadow-sm ring-1 ring-[#e2efe3] lg:sticky lg:top-24">
            <CardContent className="p-6">
              <div className="flex items-end gap-4">
                <p className="text-6xl font-bold leading-none text-[#1f2430]">
                  {data.rating.toFixed(1)}
                </p>
                <div className="pb-1">
                  <Stars value={data.rating} size="h-5 w-5" />
                  <p className="mt-1 text-sm text-slate-500">
                    {data.total} {data.total === 1 ? "reseña" : "reseñas"} en Google
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5" aria-busy={loading}>
                {([5, 4, 3, 2, 1] as StarValue[]).map((s) => (
                  <RatingBar
                    key={s}
                    stars={s}
                    count={distribution[s]}
                    percent={(distribution[s] / distributionTotal) * 100}
                  />
                ))}
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2e7d32] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#236126] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7d32] focus-visible:ring-offset-2"
              >
                Califícanos en Google
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              <p className="mt-3 text-center text-xs text-slate-500">
                Tu opinión ayuda a que más personas conozcan nuestro trabajo.
              </p>
            </CardContent>
          </Card>

          {/* Lista de reseñas */}
          <div>
            <ul className="grid gap-4 md:grid-cols-2">
              {visibleReviews.map((r) => (
                <li key={r.id}>
                  <Card className="h-full border-0 bg-[#f8fbf8] shadow-sm ring-1 ring-[#e2efe3]">
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <Avatar name={r.author} src={r.avatar} />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-[#1f2430]">{r.author}</p>
                          <p className="truncate text-sm text-slate-500">
                            {r.role ? `${r.role} · ${r.date}` : r.date}
                          </p>
                        </div>
                      </div>
                      <Stars value={r.rating} />
                      <p className="mt-3 text-base leading-relaxed text-slate-700">{r.text}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  aria-expanded={showAll}
                  className="rounded-full border border-[#2e7d32] px-5 py-2.5 font-semibold text-[#2e7d32] transition-colors hover:bg-[#eafaf3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7d32] focus-visible:ring-offset-2"
                >
                  {showAll ? "Ver menos" : `Ver más reseñas (${data.reviews.length - INITIAL_VISIBLE})`}
                </button>
              </div>
            )}

            <p className="mt-6 text-center text-xs text-slate-400 lg:text-left">
              Reseñas de Google Maps
            </p>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
