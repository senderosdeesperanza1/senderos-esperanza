"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Pause, Play } from "lucide-react";
import { sitio } from "@/components/navegacion";
import { ANIO_FUNDACION } from "@/lib/datos-fundacion";

// Cada foto tiene su propio mensaje y su propio link en "Conoce el programa".
// "Donar ahora" siempre lleva a /donar, igual en las 4.
const fotos = [
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1760927747/Home_a3o7cq.jpg",
    badge: "Corporación sin ánimo de lucro · Bogotá",
    titulo: "Educación, alimentación y esperanza para la niñez",
    texto: `Acompañamos a niñas, niños y jóvenes de 1 a 18 años y a sus familias desde ${ANIO_FUNDACION}. Con tu ayuda llegamos a más hogares.`,
    ctaHref: "/programas",
    ctaLabel: "Conoce nuestro trabajo",
  },
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1788216693/Carousel_2_xgwxig.jpg",
    badge: "Programa de Educación",
    titulo: "Educación que abre oportunidades",
    texto: "Apoyo académico, acompañamiento escolar y herramientas para que niñas, niños y jóvenes proyecten un futuro con más posibilidades.",
    ctaHref: "/programas/educacion",
    ctaLabel: "Conoce el programa",
  },
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759164956/Carousel_2_dudgsx.jpg",
    badge: "Seguridad alimentaria",
    titulo: "Alimentación que cuida y transforma",
    texto: "Apoyo directo y acompañamiento nutricional para garantizar alimentos sanos y suficientes a las familias.",
    ctaHref: "/programas/seguridad-alimentaria",
    ctaLabel: "Conoce el programa",
  },
  {
    src: "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1788216694/Carousel_4_apsbhq.jpg",
    badge: "Programa de Cuidado",
    titulo: "Familias acompañadas con esperanza",
    texto: "Acompañamiento integral y cercano para el bienestar emocional y social de cada persona.",
    ctaHref: "/programas/cuidado",
    ctaLabel: "Conoce el programa",
  },
];

const INTERVALO_MS = 6000;

export function HomeHero() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const foto = fotos[actual];

  // Respeta "reducir movimiento": el carrusel arranca detenido.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPausado(true);
  }, []);

  useEffect(() => {
    if (pausado) return;
    const timer = setInterval(() => setActual((i) => (i + 1) % fotos.length), INTERVALO_MS);
    return () => clearInterval(timer);
  }, [pausado]);

  return (
    <section
      id="inicio"
      aria-labelledby="hero-titulo"
      className="relative flex min-h-[640px] items-center overflow-hidden bg-[#123d20] text-white lg:h-[92vh]"
    >
      {/* Fotos de fondo (decorativas) */}
      <div className="absolute inset-0" aria-hidden="true">
        {fotos.map((f, i) => (
          <Image
            key={f.src}
            src={f.src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === actual ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {/* Degradado para que el texto siempre se lea */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2f18]/90 via-[#0d2f18]/60 to-[#0d2f18]/20" />
        <div className="absolute inset-0 bg-[#0d2f18]/45 lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d2f18]/70 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4 pb-28 pt-32 sm:pb-32">
        {/* key={actual}: al cambiar de foto, el bloque se vuelve a montar y entra con un fundido suave. */}
        <div key={actual} className="max-w-2xl animate-[heroFade_0.6s_ease-out] motion-reduce:animate-none">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-[#f4c542] ring-1 ring-white/20 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#f4c542]" aria-hidden="true" />
            {foto.badge}
          </p>

          <h1
            id="hero-titulo"
            className="mt-6 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {foto.titulo}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl">{foto.texto}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/donar"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#f4c542] px-8 text-lg font-bold text-[#1b3d1f] shadow-lg transition-colors hover:bg-[#ffd75e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
              Donar ahora
            </Link>
            <Link
              href={foto.ctaHref}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-white/70 px-8 text-lg font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {foto.ctaLabel}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/75">NIT {sitio.nit} · Tu donación tiene certificado</p>
        </div>
      </div>

      {/* Controles del carrusel */}
      <div className="absolute inset-x-0 bottom-6 z-10">
        <div className="container mx-auto flex items-center gap-4 px-4">
          <button
            type="button"
            onClick={() => setPausado((p) => !p)}
            aria-label={pausado ? "Reanudar el carrusel de fotos" : "Pausar el carrusel de fotos"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {pausado ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          </button>
          <div className="flex items-center" role="group" aria-label="Fotos">
            {fotos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActual(i)}
                aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                aria-current={i === actual}
                className="group flex h-10 w-8 items-center justify-center focus-visible:outline-none"
              >
                <span
                  className={`h-1.5 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-white ${
                    i === actual ? "w-6 bg-[#f4c542]" : "w-3 bg-white/60 group-hover:bg-white"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
