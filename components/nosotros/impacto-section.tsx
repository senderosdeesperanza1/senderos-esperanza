"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ANIO_FUNDACION,
  FAMILIAS_BENEFICIADAS,
  NINOS_ATENDIDOS,
  aniosDeTrayectoria,
} from "@/lib/datos-fundacion";
import {
  GraduationCap,
  HeartHandshake,
  Heart,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const DONACION_URL = "/donar";

// === Cifras (deben coincidir con las de la sección "Nosotros") ===
const stats: { value: number; label: string }[] = [
  { value: NINOS_ATENDIDOS, label: "Niños atendidos" },
  { value: FAMILIAS_BENEFICIADAS, label: "Familias beneficiadas" },
  { value: aniosDeTrayectoria(), label: "Años de trayectoria" },
  { value: 3, label: "Líneas de trabajo" },
];

// === Líneas de trabajo (basadas en la misión de la corporación) ===
const pilares: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "Educación",
    description:
      "Programas educativos que acompañan a niños y jóvenes de 1 a 18 años para que accedan a oportunidades de aprendizaje.",
  },
  {
    icon: Utensils,
    title: "Seguridad alimentaria",
    description:
      "Apoyo nutricional que garantiza una alimentación adecuada, el origen de nuestra labor desde el comedor comunitario.",
  },
  {
    icon: HeartHandshake,
    title: "Bienestar y comunidad",
    description:
      "Trabajamos junto a las familias y a las comunidades para construir soluciones sostenibles y duraderas.",
  },
];

// === Aliados ===
// Guarda cada logo en: public/aliados/  (con estos nombres exactos, o cambia la ruta).
// Recomendado: PNG con fondo transparente o SVG.
// Mientras un logo no exista o falle al cargar, se muestran las iniciales del aliado.
type Aliado = { nombre: string; logo?: string };

const aliados: Aliado[] = [
  { nombre: "Banco de Alimentos", logo: "https://imgs.search.brave.com/PBlHrifb2ncIHWSn9q4V0eSaHacQ9vnm83PPmv3qE1U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL0IvYmFuY28t/ZGUtYWxpbWVudG9z/LWRlLWJvZ290YS1s/b2dvLUUxRURFOURB/ODEtc2Vla2xvZ28u/Y29tLmdpZg.gif" },
  { nombre: "Cruz Roja", logo: "https://imgs.search.brave.com/niB0QH-4Qz5t2U05OFHLeRgEmSl6__PBkT9Zd6-fWB4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/a2luZHBuZy5jb20v/cGljYy9tLzExNS0x/MTU3MDA5X2xvZ28t/Y3J1ei1yb2phLWNv/bG9tYmlhbmEtY29s/b21iaWFuLXJlZC1j/cm9zcy1oZC5wbmc" },
  { nombre: "Contenidos El Rey", logo: "/aliados/contenidos-el-rey.png" },
  { nombre: "Activa", logo: "/aliados/activa.png" },
  { nombre: "Pan de Vida", logo: "https://imgs.search.brave.com/5_AF-eJ9SGoErTiY1CSKGAyzJ15dHAeDlDAJjlZ6ewo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zMy5l/dS1jZW50cmFsLTEu/YW1hem9uYXdzLmNv/bS9hZnJ1cy1wdWJs/aWMtcHJvZC9vcmct/MTY3Mi9pbWFnZXMv/dGVtcGxhdGVzLzAw/QUElMjBQQU4lMjBE/RSUyMFZJREElMjBD/RVIlMjBmb25kbyUy/MGJjbyUyMHJlZG9u/ZG8ucG5nPzI" },
  { nombre: "Alquería", logo: "https://imgs.search.brave.com/amVonloIWa1dYo9Zsua5ec-XnYhu78idsZyMPCbrVn4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzIwLzIvYWxxdWVy/aWEtbG9nby1wbmdf/c2Vla2xvZ28tMjA5/MTEzLnBuZw" },
  { nombre: "Harina Valle", logo: "https://imgs.search.brave.com/DpUsD8qcNpI-QbNj9edFfadnRzTRJ9zD8sE954Tr8Sg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dmVjdG9ybG9nby5l/cy93cC1jb250ZW50/L3VwbG9hZHMvMjAx/OC8wNS9sb2dvLXZl/Y3Rvci1oYXJpbmVy/YS1kZWwtdmFsbGUu/anBn" },
];

function iniciales(nombre: string) {
  const palabras = nombre.split(" ").filter((p) => p.length > 2);
  if (palabras.length <= 1) return nombre.slice(0, 2).toUpperCase();
  return palabras
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/**
 * Cuenta desde 0 hasta `value` una sola vez, cuando el número entra en pantalla.
 * Respeta "reducir movimiento" y expone el valor final a lectores de pantalla.
 */
export function CountUp({ value }: { value: number }) {
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

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out
          setDisplay(Math.round(value * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

function LogoAliado({ nombre, logo }: Aliado) {
  const [falla, setFalla] = useState(false);

  if (!logo || falla) {
    return (
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eafaf3] text-lg font-bold text-[#2e7d32]"
        aria-hidden="true"
      >
        {iniciales(nombre)}
      </span>
    );
  }

  return (
    <div className="relative h-14 w-full">
      <Image
        src={logo}
        alt={`Logo de ${nombre}`}
        fill
        sizes="(min-width: 1024px) 200px, (min-width: 768px) 30vw, 45vw"
        className="object-contain"
        onError={() => setFalla(true)}
      />
    </div>
  );
}

export function ImpactoSection() {
  return (
    <section
      id="impacto"
      aria-labelledby="impacto-titulo"
      className="scroll-mt-(--header-offset) bg-[#f5f9f6] py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1
              id="impacto-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Nuestro impacto
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Desde {ANIO_FUNDACION} acompañamos a niños y familias en situación
              de vulnerabilidad, con acciones constantes que transforman su
              presente y su futuro.
            </p>
          </div>

          {/* === Cifras === */}
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#1b5e20] shadow-sm lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="flex flex-col-reverse justify-end gap-2 bg-[#2e7d32] px-6 py-8 text-white sm:px-8 sm:py-10"
              >
                <dt className="text-base leading-snug text-white/90">
                  {item.label}
                </dt>
                <dd className="text-5xl font-bold tabular-nums tracking-tight md:text-6xl">
                  <CountUp value={item.value} />
                </dd>
              </div>
            ))}
          </dl>

          {/* === Líneas de trabajo === */}
          <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
                Cómo trabajamos
              </h3>
              <p className="mt-4 leading-relaxed text-slate-600">
                Tres líneas de trabajo que se complementan para acompañar a cada
                niño y a su familia.
              </p>
            </div>

            <ul className="divide-y divide-[#dfeee0] border-y border-[#dfeee0] lg:col-span-8">
              {pilares.map((pilar) => (
                <li key={pilar.title} className="flex gap-5 py-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                    <pilar.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h4 className="text-xl font-bold text-[#1f2430]">
                      {pilar.title}
                    </h4>
                    <p className="mt-2 max-w-xl leading-relaxed text-slate-600">
                      {pilar.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* === Aliados === */}
          <div className="mt-24">
            <div className="max-w-2xl">
              <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
                Nuestros aliados
              </h3>
              <p className="mt-4 leading-relaxed text-slate-600">
                Organizaciones y empresas que hacen posible nuestro trabajo con
                sus donaciones y su apoyo.
              </p>
            </div>

            {/* flex + justify-center: la última fila queda centrada en vez de dejar huecos */}
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {aliados.map((aliado) => (
                <li
                  key={aliado.nombre}
                  className="flex h-40 basis-[calc(50%_-_0.375rem)] flex-col items-center justify-center gap-3 rounded-xl bg-white p-5 ring-1 ring-[#dfeee0] transition-shadow hover:shadow-md md:basis-[calc(33.333%_-_0.5rem)] lg:basis-[calc(25%_-_0.5625rem)]"
                >
                  <LogoAliado nombre={aliado.nombre} logo={aliado.logo} />
                  <p className="text-center text-sm font-medium text-slate-600">
                    {aliado.nombre}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* === Llamado a donar === */}
          <div className="mt-20 flex flex-col items-start gap-8 rounded-2xl bg-[#eafaf3] p-8 ring-1 ring-[#cfe8d2] md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-2xl">
              <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
                Tu donación cambia la vida de un niño
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Cada aporte nos ayuda a seguir brindando educación,
                alimentación y acompañamiento a niños y familias que lo
                necesitan. Súmate como aliado de Senderos de Esperanza.
              </p>
            </div>
            <a
              href={DONACION_URL}
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-[#2e7d32] px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1b5e20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32]"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              Quiero donar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}