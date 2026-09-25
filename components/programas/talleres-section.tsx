import Image from "next/image";
import {
  Check,
  Gem,
  HeartPulse,
  Palette,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

// === Talleres y cursos ===
// TODO: ajusta los textos a como funcionan realmente (días, horarios, edades, materiales).
const talleres: {
  icon: LucideIcon;
  tipo: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Palette,
    tipo: "Taller",
    title: "Arte",
    description: "Talleres creativos para expresar emociones y talentos.",
  },
  {
    icon: Trophy,
    tipo: "Actividad",
    title: "Deportes",
    description:
      "Actividades físicas que promueven salud, disciplina y diversión.",
  },
  {
    icon: Gem,
    tipo: "Curso",
    title: "Elaboración de manillas",
    description:
      "Curso para aprender a hacer manillas y desarrollar creatividad, paciencia y habilidades manuales.",
  },
  {
    icon: Users,
    tipo: "Espacio",
    title: "Participación",
    description:
      "Espacios para compartir, crear comunidad y fortalecer vínculos.",
  },
];

// === Control de peso y estatura ===
// TODO: ajusta estos puntos a como se hace realmente el control (cada cuánto, quién lo realiza, cómo se usa).
const controles = [
  "Registro del peso y la estatura de cada niño de la fundación.",
  "Seguimiento de su crecimiento a lo largo del tiempo.",
  "Información para orientar su alimentación, su salud y su bienestar.",
];

// Foto opcional de los talleres. Cuando la tengas, guárdala en public/talleres/ y completa los datos:
// { src: "/talleres/taller.jpg", alt: "Descripción de lo que muestra la foto", titulo: "Un título corto para mostrar sobre la foto" }
// El título es opcional: si lo dejas vacío, la foto se muestra sin texto encima.
// Mientras FOTO_TALLERES sea null, la sección no muestra foto.
type Foto = { src: string; alt: string; titulo?: string };
const FOTO_TALLERES = null as Foto | null;

export function TalleresSection() {
  return (
    <section
      id="talleres"
      aria-labelledby="talleres-titulo"
      className="scroll-mt-(--header-offset) bg-white py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1
              id="talleres-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Tiempo libre con aprendizaje y participación
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              En su tiempo libre, las niñas, niños y jóvenes pueden participar
              en talleres que fomentan la creatividad, el trabajo en equipo y
              la construcción de habilidades para la vida.
            </p>
          </div>

          {/* === Talleres y cursos === */}
          <div className="mt-12">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
              Talleres y cursos
            </h3>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {talleres.map((taller) => (
                <li
                  key={taller.title}
                  className="flex flex-col rounded-2xl bg-[#f8fbf8] p-6 ring-1 ring-[#e2efe3]"
                >
                  <div className="mb-6 flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2e7d32] text-white">
                      <taller.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-[#eafaf3] px-3 py-1 text-xs font-semibold text-[#1b5e20] ring-1 ring-[#cfe8d2]">
                      {taller.tipo}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold leading-snug text-[#1f2430]">
                    {taller.title}
                  </h4>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {taller.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* === Foto opcional === */}
          {FOTO_TALLERES && (
            <div className="group relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-[#dfeee0] md:aspect-[16/7]">
              <Image
                src={FOTO_TALLERES.src}
                alt={FOTO_TALLERES.alt}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
              {FOTO_TALLERES.titulo && (
                <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white drop-shadow-sm sm:p-6 sm:text-xl">
                  {FOTO_TALLERES.titulo}
                </p>
              )}
            </div>
          )}

          {/* === Control de peso y estatura === */}
          <div className="mt-20 grid gap-10 rounded-2xl bg-[#1b5e20] p-8 text-white md:p-12 lg:grid-cols-12 lg:gap-16 lg:p-14">
            <div className="lg:col-span-5">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1b5e20]">
                <HeartPulse className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-balance text-2xl font-bold tracking-tight md:text-4xl">
                Control de peso y estatura
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-white/90">
                Además de los talleres, acompañamos el crecimiento de los niños
                de la fundación con un seguimiento de su peso y su estatura,
                para cuidar su salud y su bienestar.
              </p>
            </div>

            <ul className="space-y-5 lg:col-span-7 lg:pt-2">
              {controles.map((item) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="max-w-xl text-lg leading-relaxed text-white/90">
                    {item}
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