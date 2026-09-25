"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Apple,
  HeartHandshake,
  ImageIcon,
  Smile,
  Utensils,
  type LucideIcon,
} from "lucide-react";

// === Cifras (cada una cuenta de 0 al valor final cuando entra en pantalla) ===
const stats: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: 500, prefix: "+", label: "Raciones entregadas a familias beneficiarias" },
  { value: 80, label: "Personas, entre niños y adultos mayores, reciben alimentación cada día, de lunes a viernes" },
  { value: 100, suffix: "%", label: "Enfoque en nutrición, salud y sostenibilidad familiar" },
];

// === Fotos ===
// Guarda las fotos en: public/alimentacion/  (o cambia las rutas).
// Recomendado: JPG horizontal, mínimo 1200 px de ancho, menos de 500 KB cada una.
// TODO: ajusta el texto alternativo para que describa lo que realmente muestra cada foto.
const fotos = [
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1788215708/galeria7_cssydj.jpg",
    alt: "Niños recibiendo su alimentación en la fundación",
    titulo: "Alimentación para cada niño",
  },
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1788215708/galeria6_qghqe1.jpg",
    alt: "Niños compartiendo una comida en la fundación",
    titulo: "Comidas compartidas en comunidad",
  },
];

// === Cómo lo hacemos (tomado de la descripción de la sección) ===
const metodos: { icon: LucideIcon; label: string }[] = [
  { icon: Utensils, label: "Apoyo directo" },
  { icon: Apple, label: "Acompañamiento nutricional" },
];

// === A quién llegamos ===
// TODO: ajusta los textos a las actividades reales con cada grupo.
const poblaciones: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Smile,
    title: "Niños",
    description:
      "Alimentación adecuada para acompañar su crecimiento, su salud y su aprendizaje.",
  },
  {
    icon: HeartHandshake,
    title: "Adultos mayores",
    description:
      "Apoyo alimentario y nutricional para cuidar su salud, su bienestar y su dignidad.",
  },
];

// Formatea con punto de miles sin depender del idioma del navegador.
function formatoMiles(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Cuenta de 0 al valor final una sola vez, cuando el número entra en pantalla.
 * - Desacelera suavemente al final.
 * - Respeta "reducir movimiento": muestra el número final directamente.
 * - Los lectores de pantalla leen solo el valor final.
 * - Reserva el ancho final para que nada se mueva mientras cuenta.
 */
function ContadorAnimado({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    setDisplay(0);
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        timeout = setTimeout(() => {
          const inicio = performance.now();
          const paso = (ahora: number) => {
            const t = Math.min((ahora - inicio) / duration, 1);
            const suavizado = 1 - Math.pow(1 - t, 4); // ease-out quart
            setDisplay(Math.round(value * suavizado));
            if (t < 1) raf = requestAnimationFrame(paso);
          };
          raf = requestAnimationFrame(paso);
        }, delay);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [value, duration, delay]);

  const final = `${prefix}${formatoMiles(value)}${suffix}`;

  return (
    <>
      <span className="relative inline-block tabular-nums" aria-hidden="true">
        <span className="invisible">{final}</span>
        <span ref={ref} className="absolute inset-0 text-left">
          {prefix}
          {formatoMiles(display)}
          {suffix}
        </span>
      </span>
      <span className="sr-only">{final}</span>
    </>
  );
}

// Foto con respaldo: si el archivo no existe o falla, se muestra un panel neutro en vez de una imagen rota.
function FotoAlimentacion({ src, alt, titulo }: { src: string; alt: string; titulo?: string }) {
  const [falla, setFalla] = useState(false);

  return (
    <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#eafaf3] ring-1 ring-[#dfeee0]">
      {falla ? (
        <span
          className="absolute inset-0 flex items-center justify-center text-[#2e7d32]/40"
          aria-hidden="true"
        >
          <ImageIcon className="h-16 w-16" />
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

export function SeguridadAlimentariaSection() {
  return (
    <section
      id="seguridad-alimentaria"
      aria-labelledby="seguridad-alimentaria-titulo"
      className="scroll-mt-(--header-offset) bg-[#f5faf6] py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1
              id="seguridad-alimentaria-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Seguridad alimentaria: alimentación digna para cada familia
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              A través de apoyo directo y acompañamiento nutricional, buscamos
              garantizar acceso a alimentos sanos y suficientes para familias
              en situación de vulnerabilidad, con especial atención a niños y
              adultos mayores.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {metodos.map((metodo) => (
                <li
                  key={metodo.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1b5e20] ring-1 ring-[#dfeee0]"
                >
                  <metodo.icon className="h-4 w-4" aria-hidden="true" />
                  {metodo.label}
                </li>
              ))}
            </ul>
          </div>

          {/* === Nuestros números === */}
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-[#1b5e20] shadow-sm md:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end gap-3 bg-[#2e7d32] px-8 py-10 text-white md:px-10 md:py-12"
              >
                <dt className="max-w-xs text-base leading-snug text-white/90">
                  {stat.label}
                </dt>
                <dd className="text-6xl font-bold tracking-tight md:text-7xl">
                  <ContadorAnimado
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    delay={index * 250}
                  />
                </dd>
              </div>
            ))}
          </dl>

          {/* === Fotos === */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            {fotos.map((foto) => (
              <FotoAlimentacion key={foto.src} src={foto.src} alt={foto.alt} titulo={foto.titulo} />
            ))}
          </div>

          {/* === A quién llegamos === */}
          <div className="mt-20">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
              A quiénes acompañamos
            </h3>
            <ul className="mt-8 grid gap-10 md:grid-cols-2 md:gap-8">
              {poblaciones.map((grupo) => (
                <li
                  key={grupo.title}
                  className="border-t-2 border-[#2e7d32] pt-6"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                    <grupo.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h4 className="text-xl font-bold text-[#1f2430]">
                    {grupo.title}
                  </h4>
                  <p className="mt-2 max-w-md leading-relaxed text-slate-600">
                    {grupo.description}
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