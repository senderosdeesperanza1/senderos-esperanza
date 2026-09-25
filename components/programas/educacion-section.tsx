import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  Heart,
  Languages,
  Laptop,
  type LucideIcon,
} from "lucide-react";

// === Programas principales ===
// TODO: ajusta los textos a como funcionan realmente los programas (horarios, edades, grupos, etc.).
const programas: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: BookOpen,
    title: "Acompañamiento de tareas",
    description:
      "Apoyo en tareas, lectura y fortalecimiento académico para que cada niño, niña y joven avance con confianza en el colegio.",
  },
  {
    icon: Languages,
    title: "Clases de inglés",
    description:
      "Enseñanza de inglés para que los estudiantes cuenten con más herramientas para aprender, estudiar y proyectar su futuro.",
  },
];

// === Cómo acompañamos ===
const apoyos: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "Tutores",
    description: "Apoyo en tareas, lectura y fortalecimiento académico.",
  },
  {
    icon: Laptop,
    title: "Tecnología",
    description: "Acceso a herramientas digitales para mejorar el aprendizaje.",
  },
  {
    icon: Heart,
    title: "Motivación",
    description:
      "Acompañamiento para que cada estudiante continúe con ganas de aprender.",
  },
];

// Foto opcional de las clases. Cuando la tengas, guárdala en public/educacion/ y completa los datos:
// { src: "/educacion/clases.jpg", alt: "Descripción de lo que muestra la foto", titulo: "Un título corto para mostrar sobre la foto" }
// El título es opcional: si lo dejas vacío, la foto se muestra sin texto encima.
// Mientras FOTO_EDUCACION sea null, la sección no muestra foto.
type Foto = { src: string; alt: string; titulo?: string };
const FOTO_EDUCACION = null as Foto | null;

export function EducacionSection() {
  return (
    <section
      id="educacion"
      aria-labelledby="educacion-titulo"
      className="scroll-mt-(--header-offset) bg-white py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1
              id="educacion-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Educación con oportunidades reales
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Fortalecemos la educación con apoyo académico, acompañamiento
              escolar y acceso a herramientas para que niñas, niños y jóvenes
              puedan aprender, crecer y proyectar un futuro con más
              posibilidades.
            </p>
          </div>

          {/* === Programas principales === */}
          <div className="mt-12">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
              Nuestros programas educativos
            </h3>
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {programas.map((programa) => (
                <li
                  key={programa.title}
                  className="rounded-2xl bg-[#eafaf3] p-8 ring-1 ring-[#cfe8d2] md:p-10"
                >
                  <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#2e7d32] text-white">
                    <programa.icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h4 className="text-2xl font-bold text-[#1f2430]">
                    {programa.title}
                  </h4>
                  <p className="mt-3 max-w-md leading-relaxed text-slate-600">
                    {programa.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* === Foto opcional === */}
          {FOTO_EDUCACION && (
            <div className="group relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-[#dfeee0] md:aspect-[16/7]">
              <Image
                src={FOTO_EDUCACION.src}
                alt={FOTO_EDUCACION.alt}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
              {FOTO_EDUCACION.titulo && (
                <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white drop-shadow-sm sm:p-6 sm:text-xl">
                  {FOTO_EDUCACION.titulo}
                </p>
              )}
            </div>
          )}

          {/* === Cómo acompañamos === */}
          <div className="mt-20">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] md:text-3xl">
              Cómo acompañamos a los estudiantes
            </h3>
            <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
              {apoyos.map((apoyo) => (
                <li
                  key={apoyo.title}
                  className="border-t-2 border-[#2e7d32] pt-6"
                >
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                    <apoyo.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h4 className="text-xl font-bold text-[#1f2430]">
                    {apoyo.title}
                  </h4>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {apoyo.description}
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