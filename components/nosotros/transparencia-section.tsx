import Image from "next/image";
import { ExternalLink, FileText, Megaphone } from "lucide-react";


// Mensaje de la cinta de aviso al final de la página.
const AVISO = "En septiembre de 2026 se publicaron los documentos correspondientes al año 2025.";

// Documentos públicos de la fundación que se abren en una nueva pestaña.
const documentos = [
  {
    title: "Estados financieros",
    href: "https://drive.google.com/file/d/1agzKJmpsKkr2ahA9UsN8NYTN_f1WOew3/view?usp=sharing",
  },
  {
    title: "RUT con Régimen Tributario Especial",
    href: "https://drive.google.com/file/d/1zOe16W4sRoITpqo7vdQnlaaToesv-9Ji/view?usp=sharing",
  },
  {
    title: "Cámara de comercio (vigencia reciente)",
    href: "https://drive.google.com/file/d/1ub99dpCxI5TILaPMX5hAhE6CgqqONxrn/view?usp=sharing",
  },
  {
    title: "Formato de inscripción",
    href: "https://drive.google.com/file/d/1bnWqx-DScXdNaOEUmWQ-bTTyLXda0KDL/view?usp=sharing",
  },
  {
    title: "Formato de uso de imagen",
    href: "https://drive.google.com/file/d/1NroS7OZ8VrBbiShXfaSTfhHzKlKA684Z/view?usp=sharing",
  },
];

// Sección principal de transparencia: presenta la misión, el valor social y los documentos oficiales.
export function TransparenciaSection() {
  return (
    <section id="transparencia" className="bg-[#f5f8f5] py-20 text-[#1f2430]">
      <div className="container mx-auto px-4">
        {/* Bloque principal: imagen + texto institucional con la propuesta de transparencia. */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1.35fr]">
          <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(31,36,48,0.12)] ring-1 ring-[#dfeee0]">
            <Image
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80"
              alt="Fundación Senderos de Esperanza"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-4 text-2xl font-extrabold uppercase tracking-tight text-[#1f2430] md:text-4xl">
              El 100% de los fondos son
            </p>
            <h1 className="mb-6 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-[#2e7d32] md:text-7xl">
              Sin ánimo de lucro
            </h1>

            <div className="space-y-6 text-base leading-relaxed text-slate-700 md:text-[1.05rem]">
              <p>
                Somos una organización vigilada por la Alcaldía de Bogotá. La DIAN nos calificó
                dentro del Régimen Tributario Especial al comprobar que cumplimos con nuestras
                actividades meritorias. Por eso todos nuestros documentos y estados financieros
                son públicos y de libre consulta.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <p>
                  Además, aplicamos un código de ética y procedimientos estrictos para garantizar
                  que la totalidad de los recursos financieros y humanos se destinen al
                  cumplimiento de nuestra misión de servicio con la niñez y las familias que
                  acompañamos.
                </p>
                <p>
                  Si en algún momento quiere sugerirnos alguna medida adicional para hacer
                  seguimiento a su donación, será bienvenida.
                </p>
              </div>
            </div>
          </div>
        </div>

        
        {/* Sección de documentos: lista de archivos públicos para seguimiento y consulta. */}
        <div className="mt-14">
          <div className="mb-10 flex flex-col items-center text-center">
            <h3 className="text-balance text-2xl font-bold text-[#1f2430] sm:text-3xl">
              Documentación y convocatorias
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
              Consulta en PDF nuestros documentos oficiales, con los detalles de los programas y
              las convocatorias vigentes.
            </p>
          </div>

          <ul className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {documentos.map((doc) => (
              <li key={doc.href}>
                {/* Toda la tarjeta es el enlace: área de clic amplia, sobre todo en móvil. */}
                <a
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col gap-5 rounded-2xl border border-[#dfeee0] bg-white p-5 shadow-sm transition-shadow hover:border-[#2e7d32]/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2e7d32] sm:flex-row sm:items-center"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#eafaf3] text-[#2e7d32]">
                    <FileText className="h-7 w-7" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold leading-snug text-[#1f2430]">
                      {doc.title}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                      <span className="rounded bg-[#eafaf3] px-1.5 py-0.5 text-xs font-bold text-[#2e7d32]">
                        PDF
                      </span>
                      Documento oficial
                    </span>
                  </span>

                  <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#2e7d32] px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-[#1b5e20]">
                    Ver documento
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(se abre en una pestaña nueva)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Aviso institucional: cinta continua sin saltos; se pausa al pasar el mouse y se detiene con "reducir movimiento". */}
      <div className="container mx-auto mt-10 px-4">
        <div
          role="region"
          aria-label="Aviso de publicación de documentos"
          className="flex items-stretch overflow-hidden rounded-2xl border border-[#dfeee0] bg-white shadow-[0_18px_45px_rgba(46,125,50,0.12)]"
        >
          <div className="z-10 flex shrink-0 items-center gap-2 bg-[#2e7d32] px-4 text-xs font-bold uppercase tracking-[0.16em] text-white sm:px-6">
            <Megaphone className="h-4 w-4 text-[#f4c542]" aria-hidden="true" />
            Aviso
          </div>

          <div className="group relative flex-1 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            {/* Un solo mensaje: entra por la derecha, cruza y sale por la izquierda antes de reaparecer. */}
            <p className="w-max animate-[aviso_22s_linear_infinite] whitespace-nowrap pl-[100%] text-sm font-semibold text-[#1f2430] will-change-transform group-hover:[animation-play-state:paused] motion-reduce:animate-none motion-reduce:pl-4">
              {AVISO}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}