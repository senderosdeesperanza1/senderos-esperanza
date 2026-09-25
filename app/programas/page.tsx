import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { programas } from "@/components/navegacion";

export const metadata: Metadata = {
  title: "Programas",
  description:
    "Conoce los programas de Senderos de Esperanza: educación, seguridad alimentaria, cuidado, talleres y respuesta al terremoto.",
  alternates: { canonical: "/programas/" },
};

export default function ProgramasPage() {
  return (
    <div className="bg-[#f5faf6] pt-(--header-offset)">
      <section aria-labelledby="programas-titulo" className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            <h1
              id="programas-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Nuestros programas
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Trabajamos de forma integral con niñas, niños, jóvenes y familias.
              Elige un programa para conocer en qué consiste y cómo puedes
              apoyarlo.
            </p>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programas.map(
              ({ href, label, descripcion, icono: Icono, imagen }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#dfeee0] transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e7d32]"
                  >
                    {imagen && (
                      <div className="relative h-52 w-full overflow-hidden bg-[#eafaf3]">
                        <Image
                          src={imagen}
                          alt={label}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-7">
                      {Icono && (
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                          <Icono className="h-6 w-6" aria-hidden="true" />
                        </span>
                      )}
                      <h2 className="mt-5 text-xl font-bold text-[#1f2430]">
                        {label}
                      </h2>
                      <p className="mt-2 flex-1 leading-relaxed text-slate-600">
                        {descripcion}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2e7d32] group-hover:text-[#1b5e20]">
                        Conocer más
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
