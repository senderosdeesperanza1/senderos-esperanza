"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Baby,
  BedDouble,
  Droplets,
  Footprints,
  GlassWater,
  PackageOpen,
  Pill,
  Shirt,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";

// === Cifra ===
const FAMILIAS_ATENDIDAS = 1500;

// Formatea con punto de miles (1500 -> "1.500") sin depender del idioma del navegador,
// así el servidor y el navegador siempre muestran lo mismo.
function formatoMiles(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Cuenta de 0 al valor final una sola vez, cuando el número entra en pantalla.
 * - Desacelera suavemente al final (efecto profesional, no mecánico).
 * - Respeta "reducir movimiento": en ese caso muestra el número final directamente.
 * - Los lectores de pantalla reciben solo el valor final, no cada paso del conteo.
 */
function ConteoAnimado({ value, duration = 2200 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    setDisplay(0);
    let raf = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min((ahora - inicio) / duration, 1);
          const suavizado = 1 - Math.pow(1 - t, 4); // ease-out quart
          setDisplay(Math.round(value * suavizado));
          if (t < 1) raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <>
      {/* El número invisible reserva el ancho final: nada se mueve mientras cuenta. */}
      <span className="relative inline-block" aria-hidden="true">
        <span className="invisible">{formatoMiles(value)}</span>
        <span ref={ref} className="absolute inset-0 text-left">
          {formatoMiles(display)}
        </span>
      </span>
      <span className="sr-only">{formatoMiles(value)}</span>
    </>
  );
}

// === Fotos de la ayuda entregada ===
// Guarda las fotos en: public/terremoto/  (o cambia las rutas).
// Recomendado: JPG horizontal o vertical, mínimo 1200 px de ancho, menos de 500 KB cada una.
// TODO: ajusta el texto alternativo para que describa lo que realmente muestra cada foto.
const fotos = [
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1788215705/galeria16_jktqpf.jpg",
    alt: "Entrega de ayudas a familias afectadas por el terremoto",
    titulo: "Entrega de ayuda humanitaria",
  },
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1788215705/galeria15_cu3nge.jpg",
    alt: "Ayudas humanitarias preparadas para las familias afectadas",
    titulo: "Ayudas listas para las familias",
  },
];

// === Ayudas entregadas ===
const ayudas: { icon: LucideIcon; label: string }[] = [
  { icon: ShoppingBasket, label: "Mercados" },
  { icon: Shirt, label: "Ropa" },
  { icon: GlassWater, label: "Bebidas" },
  { icon: BedDouble, label: "Colchonetas" },
  { icon: Pill, label: "Medicamentos" },
  { icon: Footprints, label: "Calzado" },
  { icon: Baby, label: "Leche para bebés" },
  { icon: Droplets, label: "Artículos de aseo" },
];

// === Cómo respondemos ===
const pilares = [
  {
    title: "Respuesta",
    description: "Atención inmediata a familias afectadas con apoyo solidario.",
  },
  {
    title: "Reconstrucción",
    description:
      "Apoyo para recuperar hogares, estabilidad y sentido de comunidad.",
  },
  {
    title: "Esperanza",
    description:
      "Acompañamiento constante para fortalecer la continuidad y la paz.",
  },
];

// Foto con respaldo: si el archivo no existe o falla, se muestra un panel neutro en vez de una imagen rota.
function FotoAyuda({ src, alt, titulo }: { src: string; alt: string; titulo?: string }) {
  const [falla, setFalla] = useState(false);

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#eafaf3] ring-1 ring-[#dfeee0]">
      {falla ? (
        <span
          className="absolute inset-0 flex items-center justify-center text-[#2e7d32]/40"
          aria-hidden="true"
        >
          <PackageOpen className="h-16 w-16" />
        </span>
      ) : (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1152px) 570px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFalla(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
          {titulo && (
            <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white drop-shadow-sm sm:p-5">
              {titulo}
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function TerremotoSection() {
  return (
    <section
      id="terremoto"
      aria-labelledby="terremoto-titulo"
      className="scroll-mt-(--header-offset) bg-[#f5faf6] py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1
              id="terremoto-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Terremoto: respuesta comunitaria y reconstrucción con esperanza
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Ante situaciones de crisis, activamos respuesta inmediata con
              apoyo humanitario, cuidado, seguimiento y coordinación para
              reconstruir la seguridad y la tranquilidad de las familias.
            </p>
          </div>

          {/* === Cifra (franja propia, separada de las fotos) === */}
          <dl className="mt-12 flex flex-col gap-3 rounded-2xl bg-[#2e7d32] px-8 py-10 text-white md:flex-row md:items-center md:gap-10 md:px-12 md:py-12">
            <dd className="order-1 text-7xl font-bold tabular-nums tracking-tight md:border-r md:border-white/25 md:pr-10 md:text-8xl">
              <ConteoAnimado value={FAMILIAS_ATENDIDAS} />
            </dd>
            <dt className="order-2 max-w-md text-xl leading-snug text-white/90 md:text-2xl">
              Familias a las que llegó nuestra ayuda
            </dt>
          </dl>

          {/* === Fotos === */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {fotos.map((foto) => (
              <FotoAyuda key={foto.src} src={foto.src} alt={foto.alt} titulo={foto.titulo} />
            ))}
          </div>

          {/* === Qué entregamos === */}
          <div className="mt-20">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
              Qué entregamos a las familias
            </h3>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {ayudas.map((ayuda) => (
                <li
                  key={ayuda.label}
                  className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-[#dfeee0]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                    <ayuda.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-medium leading-snug text-[#1f2430]">
                    {ayuda.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* === Cómo respondemos === */}
          <div className="mt-20">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
              Cómo respondemos
            </h3>
            <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
              {pilares.map((pilar) => (
                <li
                  key={pilar.title}
                  className="border-t-2 border-[#2e7d32] pt-6"
                >
                  <h4 className="text-xl font-bold text-[#1f2430]">
                    {pilar.title}
                  </h4>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {pilar.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}