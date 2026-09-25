"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { SVGProps } from "react";
import {
  Heart,
  Users,
  Target,
  Smile,
  Home,
  BookOpen,
  Wheat,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FAMILIAS_BENEFICIADAS, NINOS_ATENDIDOS } from "@/lib/datos-fundacion";

// === Contador animado (número que cuenta de 0 al valor final) ===
// Formatea con punto de miles (1500 -> "1.500") sin depender del idioma del navegador.
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
  duration = 2000,
  delay = 0,
}: {
  value: number;
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

  return (
    <>
      <span className="relative inline-block tabular-nums" aria-hidden="true">
        <span className="invisible">{formatoMiles(value)}</span>
        <span ref={ref} className="absolute inset-0 text-center">
          {formatoMiles(display)}
        </span>
      </span>
      <span className="sr-only">{formatoMiles(value)}</span>
    </>
  );
}

// Pictograma del ODS 10 (flechas y signo igual)
function IconoDesigualdades(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <polygon points="50,6 74,32 26,32" />
      <polygon points="50,94 74,68 26,68" />
      <polygon points="6,50 32,26 32,74" />
      <polygon points="94,50 68,26 68,74" />
      <rect x="36" y="40" width="28" height="8" />
      <rect x="36" y="52" width="28" height="8" />
    </svg>
  );
}

// === ODS en los que nos enfocamos (colores oficiales de la ONU) ===
// `textoOscuro: true` se usa en fondos claros para mantener buen contraste.
// `imagen` (opcional): ícono oficial del ODS como imagen en vez del ícono genérico.
// Descárgalo de https://www.un.org/sustainabledevelopment/news/communications-material/
// (sección "E-Icons: With text" o "Without text"), guárdalo en public/ods/ (ej: ods-1.png)
// y escribe aquí la ruta: imagen: "/ods/ods-1.png". Mientras quede en undefined, se usa
// el ícono de respaldo; si la imagen falla al cargar, también vuelve al ícono de respaldo.
const odsDestacados = [
  {
    numero: 1,
    titulo: "Fin de la pobreza",
    color: "#E5243B",
    icono: Users,
    imagen: "https://www.un.org/sustainabledevelopment/wp-content/uploads/sites/3/2019/09/S-WEB-Goal-01-200x200.png",
  },
  {
    numero: 2,
    titulo: "Hambre cero",
    color: "#DDA63A",
    icono: Wheat,
    textoOscuro: true,
    imagen: "https://www.un.org/sustainabledevelopment/wp-content/uploads/sites/3/2019/09/S-WEB-Goal-02-200x200.png",
  },
  {
    numero: 4,
    titulo: "Educación de calidad",
    color: "#C5192D",
    icono: BookOpen,
    imagen: "https://www.un.org/sustainabledevelopment/wp-content/uploads/sites/3/2019/09/S-WEB-Goal-04-200x200.png",
  },
  {
    numero: 10,
    titulo: "Reducción de las desigualdades",
    color: "#DD1367",
    icono: IconoDesigualdades,
    imagen: "https://www.un.org/sustainabledevelopment/wp-content/uploads/sites/3/2019/09/S-WEB-Goal-10-200x200.png",
  },
];

// Muestra la imagen oficial del ODS si existe; si no hay imagen o falla al cargar, usa el ícono de respaldo.
function IconoOds({ item }: { item: (typeof odsDestacados)[number] }) {
  const [falla, setFalla] = useState(false);

  if (item.imagen && !falla) {
    return (
      <Image
        src={item.imagen}
        alt={`ODS ${item.numero}: ${item.titulo}`}
        width={200}
        height={200}
        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        onError={() => setFalla(true)}
      />
    );
  }

  const Icono = item.icono;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl text-white" style={{ backgroundColor: item.color }}>
      <Icono className="h-16 w-16" strokeWidth={1.25} aria-hidden="true" />
      <p className="text-center text-xs font-bold uppercase leading-tight">
        {item.numero}. {item.titulo}
      </p>
    </div>
  );
}

// === Premios y reconocimientos (foto + descripción) ===
// Para agregar uno, copia un bloque dentro de la lista. Mientras la lista esté vacía, la sección no se muestra.
//   {
//     foto: "https://res.cloudinary.com/.../foto.jpg", // o "/premios/foto.jpg" si la subes a /public/premios
//     fotoAlt: "Quién aparece y qué ocurre en la foto",
//     titulo: "Un título corto para mostrar sobre la foto (opcional)",
//     descripcion: "Breve explicación del premio o reconocimiento.",
//   },
const premios: { foto: string; fotoAlt: string; titulo?: string; descripcion: string }[] = [];

export function NosotrosSection() {
  const values = [
    {
      icon: Heart,
      title: "Compromiso",
      description: "Dedicados a transformar vidas con pasión y responsabilidad",
    },
    {
      icon: Users,
      title: "Comunidad",
      description:
        "Trabajamos junto a las comunidades para crear soluciones sostenibles",
    },
    {
      icon: Target,
      title: "Impacto",
      description: "Medimos nuestro éxito por las vidas que transformamos",
    },
  ];

  // === Nuestros números ===
  // Mismas cifras que en Inicio y en Nosotros > Impacto (una sola fuente: lib/datos-fundacion.ts).
  const stats = [
    { icon: Smile, value: NINOS_ATENDIDOS, label: "Niños atendidos" },
    { icon: Home, value: FAMILIAS_BENEFICIADAS, label: "Familias beneficiadas" },
  ];

  return (
    <section id="nosotros" className="bg-background pt-(--header-offset)">
      {/* === Imagen con texto sobrepuesta === */}
      <div className="relative w-full h-[450px] mb-20">
        <Image
          src="https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759165258/About_qvlzfe.jpg"
          alt="Conoce Nuestra Historia"
          fill
          className="object-cover"
          priority
        />
        {/* Capa oscura para mejorar contraste */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Texto centrado sobre la imagen */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Sobre Nosotros
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 md:pb-28">
        {/* === Misión y visión === */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-20">
          <div className="bg-muted/40 p-8 rounded-lg">
            <h3 className="text-3xl font-bold mb-4 text-[#2e7d32]">
              Nuestra Misión
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Facilitar procesos de desarrollo integral y sostenible en
              comunidades vulnerables, promoviendo la educación, la seguridad
              alimentaria y el bienestar como pilares para un futuro con
              esperanza.
            </p>
          </div>
          <div className="bg-muted/40 p-8 rounded-lg">
            <h3 className="text-3xl font-bold mb-4 text-[#2e7d32]">
              Nuestra Visión
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ser una organización líder y referente en la construcción de
              comunidades autosuficientes y resilientes, donde cada individuo
              tenga la oportunidad de alcanzar su máximo potencial.
            </p>
          </div>
        </div>

        {/* === Reseña Histórica === */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h3 className="text-3xl font-bold mb-6 text-[#2e7d32]">
            Reseña Histórica
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed text-balance">
            Desde nuestra Corporación Senderos de Esperanza en 2007, hemos
            trabajado incansablemente para ser un faro de esperanza. Lo que
            comenzó como un pequeño comedor comunitario ha florecido hasta
            convertirse en una organización integral que ofrece programas
            educativos, apoyo nutricional y desarrollo comunitario, impactando
            positivamente la vida de cientos de niños y sus familias a lo largo
            de los años.
          </p>
        </div>

        {/* === Historia de la Fundadora === */}
        <div className="grid md:grid-cols-3 gap-12 items-center max-w-5xl mx-auto mb-20">
          <div className="group relative w-64 h-64 mx-auto overflow-hidden rounded-full shadow-lg md:w-full md:h-80">
            <Image
              src="https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763480821/Zulma_nrgfma.jpg"
              alt="Zulma Mayoma, fundadora de Senderos de Esperanza"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4 text-[#2e7d32]">
              La Historia de Nuestra Fundadora: Zulma Manyoma
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Zulma Mayoma, una mujer con un corazón inmenso y una visión clara,
              es el alma de Senderos de Esperanza. Creció en una comunidad donde
              las oportunidades eran escasas, pero la resiliencia y el espíritu
              de ayuda mutua eran abundantes. Testigo de las dificultades que
              enfrentaban los niños para acceder a una educación de calidad y
              una nutrición adecuada, sintió un llamado profundo a la acción.
            </p>
          </div>
        </div>

        {/* === Nuestros números === */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#2e7d32]">
            Nuestros números
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="border-2 hover:border-[#2e7d32] transition-colors"
              >
                <CardContent className="pt-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2e7d32] text-white mb-4">
                    <stat.icon size={32} />
                  </div>
                  <p className="text-5xl font-bold text-[#2e7d32] mb-2">
                    <ContadorAnimado value={stat.value} delay={index * 250} />
                  </p>
                  <p className="text-lg text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* === Valores === */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-2 hover:border-[#2e7d32] transition-colors"
            >
              <CardContent className="pt-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2e7d32] text-white mb-4">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        
        {/* === Objetivos de Desarrollo Sostenible === */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#2e7d32]">
              Compromiso global
            </p>
            <h3 className="text-balance text-3xl font-bold text-[#1f2430] md:text-4xl">
              Objetivos de Desarrollo Sostenible
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Nuestro trabajo se alinea con la agenda global de las Naciones Unidas.
              Nos identificamos especialmente con estos ODS:
            </p>
          </div>

          {/* Cada insignia oficial ya trae el número, el título y el pictograma:
              se muestra sola, sin repetir el texto encima. */}
          <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {odsDestacados.map((item) => (
              <li key={item.numero}>
                <div className="group flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#dfeee0] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <IconoOds item={item} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* === Algunos de nuestros premios y reconocimientos ===
            Se llena desde la lista `premios` de arriba; mientras esté vacía muestra 3 espacios de ejemplo. */}
        {(
          <div className="max-w-6xl mx-auto mt-20" aria-labelledby="premios-destacados">
            <h3
              id="premios-destacados"
              className="text-balance text-center text-3xl md:text-4xl font-bold text-[#2e7d32]"
            >
              Algunos de nuestros premios y reconocimientos
            </h3>

            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {premios.length === 0 &&
                [1, 2, 3].map((n) => (
                  <li key={n}>
                    <Card className="h-full overflow-hidden border-2 border-dashed py-0 gap-0">
                      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-[#eafaf3] text-[#2e7d32]">
                        <Award className="h-12 w-12" aria-hidden="true" />
                        <span className="text-sm font-semibold">Foto del reconocimiento</span>
                      </div>
                      <CardContent className="p-6">
                        <p className="leading-relaxed text-muted-foreground">
                          Aquí irá la descripción del premio o reconocimiento.
                        </p>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              {premios.map((premio) => (
                <li key={premio.foto}>
                  <Card className="group h-full overflow-hidden border-2 py-0 gap-0 hover:border-[#2e7d32] transition-colors">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#eafaf3]">
                      <Image
                        src={premio.foto}
                        alt={premio.fotoAlt}
                        fill
                        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent" />
                      {premio.titulo && (
                        <p className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-lg font-bold text-white drop-shadow-sm">
                          {premio.titulo}
                        </p>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="leading-relaxed text-muted-foreground">{premio.descripcion}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}