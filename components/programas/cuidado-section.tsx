import Image from "next/image";
import {
  Bus,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

// === Líneas de cuidado ===
const pilares: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: MessageCircle,
    title: "Escucha",
    description: "Acompañamiento emocional con respeto y atención individual.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad",
    description:
      "Espacios de calma, confianza y contención para niños, niñas y familias.",
  },
  {
    icon: HeartPulse,
    title: "Bienestar",
    description: "Enfoque en salud mental, vínculos y calidad de vida.",
  },
];

// === Recogida de niños en los colegios: recorrido paso a paso ===
// TODO: ajusta estos pasos a como funciona realmente la recogida (quién acompaña, cómo se coordina, etc.).
const pasosRecogida = [
  {
    title: "Recogida en el colegio",
    description: "Recibimos a los niños a la salida de clase.",
  },
  {
    title: "Trayecto acompañado",
    description: "Están cuidados durante todo el recorrido.",
  },
  {
    title: "Llegada segura",
    description:
      "Las familias tienen la tranquilidad de saber que sus hijos están bien cuidados.",
  },
];

// Foto opcional de la recogida. Cuando la tengas, guárdala en public/cuidado/ y completa los datos:
// { src: "/cuidado/recogida.jpg", alt: "Descripción de lo que muestra la foto", titulo: "Un título corto para mostrar sobre la foto" }
// El título es opcional: si lo dejas vacío, la foto se muestra sin texto encima.
// Mientras FOTO_RECOGIDA sea null, el bloque no muestra foto.
type Foto = { src: string; alt: string; titulo?: string };
const FOTO_RECOGIDA = null as Foto | null;

// Lista opcional de colegios donde se hace la recogida (ejemplo: ["Colegio A", "Colegio B"]).
// Mientras esté vacía, no se muestra.
const colegios: string[] = [];

export function CuidadoSection() {
  return (
    <section
      id="cuidado"
      aria-labelledby="cuidado-titulo"
      className="scroll-mt-(--header-offset) bg-[#f5faf6] py-20 md:py-28"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* === Encabezado === */}
          <div className="max-w-3xl">
            <h1
              id="cuidado-titulo"
              className="text-balance text-3xl font-bold tracking-tight text-[#1f2430] md:text-5xl"
            >
              Acompañamiento integral con cuidado humano
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Reconocemos que el bienestar emocional y social es esencial para
              el desarrollo de cada persona. Por eso brindamos cuidado cercano,
              escucha y apoyo constante.
            </p>
          </div>

          {/* === Líneas de cuidado === */}
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {pilares.map((pilar) => (
              <li
                key={pilar.title}
                className="border-t-2 border-[#2e7d32] pt-6"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                  <pilar.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold text-[#1f2430]">
                  {pilar.title}
                </h3>
                <p className="mt-2 leading-relaxed text-slate-600">
                  {pilar.description}
                </p>
              </li>
            ))}
          </ul>

          {/* === Recogida de niños en los colegios === */}
          <div className="mt-24 grid gap-12 rounded-2xl bg-[#1b5e20] p-8 text-white md:p-12 lg:grid-cols-12 lg:gap-16 lg:p-14">
            <div className="lg:col-span-5">
              <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1b5e20]">
                <Bus className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="text-balance text-2xl font-bold tracking-tight md:text-4xl">
                Recogida de niños en los colegios
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-white/90">
                El cuidado también incluye el camino. Recogemos a los niños en
                sus colegios para que el trayecto sea seguro y acompañado, y
                para que las familias tengan tranquilidad.
              </p>
            </div>

            <ol className="lg:col-span-7 lg:pt-2">
              {pasosRecogida.map((paso, index) => (
                <li
                  key={paso.title}
                  className="relative pb-8 pl-16 before:absolute before:bottom-0 before:left-5 before:top-12 before:w-px before:bg-white/30 last:pb-0 last:before:hidden"
                >
                  <span
                    className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold tabular-nums text-[#1b5e20]"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <h4 className="pt-1.5 text-xl font-bold">{paso.title}</h4>
                  <p className="mt-1.5 max-w-xl leading-relaxed text-white/85">
                    {paso.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* === Foto opcional === */}
          {FOTO_RECOGIDA && (
            <div className="group relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-[#dfeee0] md:aspect-[16/7]">
              <Image
                src={FOTO_RECOGIDA.src}
                alt={FOTO_RECOGIDA.alt}
                fill
                sizes="(min-width: 1152px) 1152px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
              {FOTO_RECOGIDA.titulo && (
                <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white drop-shadow-sm sm:p-6 sm:text-xl">
                  {FOTO_RECOGIDA.titulo}
                </p>
              )}
            </div>
          )}

          {/* === Colegios opcionales === */}
          {colegios.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-bold text-[#1f2430]">
                Colegios donde hacemos la recogida
              </h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {colegios.map((colegio) => (
                  <li
                    key={colegio}
                    className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#1b5e20] ring-1 ring-[#dfeee0]"
                  >
                    {colegio}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}