import Link from "next/link";
import { ArrowRight, Handshake, HandHeart, HeartHandshake } from "lucide-react";
import { HomeHero } from "@/components/home/hero";
import { CountUp } from "@/components/nosotros/impacto-section";
import { programas, sitio } from "@/components/navegacion";
import {
  ANIO_FUNDACION,
  FAMILIAS_BENEFICIADAS,
  NINOS_ATENDIDOS,
  aniosDeTrayectoria,
} from "@/lib/datos-fundacion";

const cifras = [
  { valor: NINOS_ATENDIDOS, etiqueta: "Niños atendidos" },
  { valor: FAMILIAS_BENEFICIADAS, etiqueta: "Familias beneficiadas" },
  { valor: aniosDeTrayectoria(), etiqueta: "Años de trayectoria" },
  { valor: programas.length, etiqueta: "Programas activos" },
];

const formasDeAyudar = [
  {
    icono: HeartHandshake,
    titulo: "Dona",
    texto: "Un aporte único, desde $5.000, con pago seguro y certificado de donación.",
    href: "/donar",
    accion: "Donar ahora",
  },
  {
    icono: HandHeart,
    titulo: "Sé voluntario",
    texto: "Únete a nuestro equipo de voluntarios y acompaña a las familias en sus necesidades.",
    href: "/contacto",
    accion: "Hablemos",
  },
  {
    icono: Handshake,
    titulo: "Aliado o empresa",
    texto: "Súmate con donaciones en especie, alianzas o campañas de tu empresa.",
    href: "/contacto",
    accion: "Hablemos",
  },
];

export function Home() {
  return (
    <>
      <HomeHero />

      {/* Cifras */}
      <section aria-label="Nuestro impacto en cifras" className="bg-[#1b5e20] text-white">
        <dl className="container mx-auto grid grid-cols-2 gap-y-8 px-4 py-10 lg:grid-cols-4">
          {cifras.map((c) => (
            <div key={c.etiqueta} className="flex flex-col-reverse items-center gap-1 text-center">
              <dt className="text-sm text-white/85 md:text-base">{c.etiqueta}</dt>
              <dd className="text-4xl font-bold tabular-nums tracking-tight text-[#f4c542] md:text-5xl">
                <CountUp value={c.valor} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Quiénes somos */}
      <section aria-labelledby="quienes-titulo" className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2e7d32]">
                Quiénes somos
              </p>
              <h2
                id="quienes-titulo"
                className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-4xl"
              >
                Más de {aniosDeTrayectoria()} años acompañando a las familias
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-slate-600">{sitio.descripcion}</p>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Nuestro trabajo empezó en {ANIO_FUNDACION} y hoy combina educación, alimentación y
                cuidado para que cada niño crezca con más oportunidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programas */}
      <section aria-labelledby="programas-titulo" className="bg-[#f5faf6] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2e7d32]">
                Programas
              </p>
              <h2
                id="programas-titulo"
                className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-4xl"
              >
                Así transformamos tu ayuda en oportunidades
              </h2>
            </div>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programas.map(({ href, label, descripcion, icono: Icono }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-[#dfeee0] transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32]"
                  >
                    {Icono && (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                        <Icono className="h-6 w-6" aria-hidden="true" />
                      </span>
                    )}
                    <h3 className="mt-5 text-xl font-bold text-[#1f2430]">{label}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-slate-600">{descripcion}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] group-hover:text-[#1b5e20]">
                      Ver programa
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cómo ayudar */}
      <section aria-labelledby="ayudar-titulo" className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2e7d32]">
                Cómo ayudar
              </p>
              <h2
                id="ayudar-titulo"
                className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-4xl"
              >
                Hay muchas formas de ser parte
              </h2>
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {formasDeAyudar.map(({ icono: Icono, titulo, texto, href, accion }) => (
                <li key={titulo} className="flex flex-col rounded-2xl bg-[#f8fbf8] p-8 ring-1 ring-[#e2efe3]">
                  <Icono className="h-9 w-9 text-[#2e7d32]" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-bold text-[#1f2430]">{titulo}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-slate-600">{texto}</p>
                  <Link
                    href={href}
                    className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#2e7d32] px-6 font-semibold text-white transition-colors hover:bg-[#1b5e20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32]"
                  >
                    {accion}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
