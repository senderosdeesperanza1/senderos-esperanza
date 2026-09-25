import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  FileText,
  HeartHandshake,
  Lock,
  Mail,
  Scale,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { LegalToc, type TocGroup } from "@/components/legal-toc";

export const metadata: Metadata = {
  title: "Política, Términos y Condiciones",
  description: "Política de privacidad, tratamiento de datos personales y términos y condiciones de uso de Corporación Senderos de Esperanza.",
  alternates: { canonical: "/privacy-policy/" },
};

type LegalSection = { id?: string; title: string; paragraphs: string[] };

const terms: LegalSection[] = [
  { id: "terminos", title: "1. Condiciones generales y aceptación", paragraphs: [
    "Estas condiciones generales regulan el uso de este sitio web, sus redes sociales y demás canales de comunicación de Corporación Senderos de Esperanza (en adelante, la “Corporación” o el “Portal”). Al acceder, navegar o utilizar el Portal, la persona usuaria acepta plenamente estas condiciones en la versión publicada en ese momento.",
    "Algunos servicios pueden estar sujetos a condiciones particulares, avisos, reglamentos o instrucciones adicionales. Antes de usar dichos servicios, la persona usuaria deberá revisar las condiciones que les sean aplicables.",
  ] },
  { title: "2. Acceso y uso correcto del Portal", paragraphs: [
    "El acceso al Portal es gratuito, salvo que se indique expresamente lo contrario para algún servicio, actividad, donación o programa específico. Ciertos servicios pueden requerir inscripción, registro o el cumplimiento de requisitos particulares.",
    "La persona usuaria se compromete a utilizar el Portal, sus servicios y contenidos de conformidad con la ley, estas condiciones, la moral, las buenas costumbres y el orden público. Queda prohibido utilizarlo con fines ilícitos, lesivos de derechos de terceros o que puedan dañar, sobrecargar, deteriorar o impedir su funcionamiento normal.",
  ] },
  { title: "3. Contenidos y propiedad intelectual", paragraphs: [
    "Los textos, fotografías, imágenes, marcas, logotipos, gráficos, videos, diseños y demás contenidos del Portal son propiedad de la Corporación o de sus respectivos titulares y están protegidos por las normas aplicables de propiedad intelectual.",
    "No está permitida la modificación, reproducción, publicación, distribución, transferencia, ingeniería inversa ni uso comercial de los contenidos sin autorización previa y por escrito del titular correspondiente, excepto cuando la ley lo permita expresamente. El acceso al Portal no concede licencia ni derecho de uso sobre sus contenidos, marcas o signos distintivos.",
    "La persona usuaria deberá abstenerse de obtener contenidos mediante mecanismos distintos de los habilitados por el Portal cuando ello implique un riesgo de daño, inutilización o afectación de los servicios o contenidos.",
  ] },
  { title: "4. Uso de los contenidos", paragraphs: [
    "Los contenidos deben utilizarse de manera diligente, correcta y lícita. En particular, no podrán copiarse, transformarse, comunicarse públicamente, eliminarse sus avisos de autoría o medidas de protección, ni emplearse para enviar publicidad no solicitada, comunicaciones comerciales o para comercializar o divulgar información obtenida a través del Portal sin autorización.",
  ] },
  { title: "5. Hipervínculos y sitios de terceros", paragraphs: [
    "Quien desee establecer un enlace hacia el Portal deberá hacerlo de forma que no reproduzca sus páginas, no cree marcos o entornos de navegación sobre ellas, no haga declaraciones falsas sobre la Corporación y no use sus marcas o signos distintivos sin autorización. El enlace no implica relación, aprobación ni supervisión de la página que lo establece.",
    "El Portal puede incluir enlaces, directorios, botones o herramientas para facilitar el acceso a sitios administrados por terceros. La Corporación no controla, aprueba ni hace propios los contenidos, productos, servicios, disponibilidad, seguridad o políticas de dichos sitios. La navegación y uso de sitios enlazados se realiza bajo responsabilidad de la persona usuaria.",
  ] },
  { title: "6. Responsabilidad de la persona usuaria", paragraphs: [
    "La persona usuaria responderá por los daños y perjuicios que la Corporación pueda sufrir como consecuencia del incumplimiento de estas condiciones o de la ley. Está prohibido publicar o transmitir información falsa, abusiva, difamatoria, obscena, amenazante o que vulnere derechos de terceros; suplantar identidades; recolectar datos personales sin autorización; infringir derechos de propiedad intelectual; o introducir virus, código malicioso o cualquier elemento que afecte sistemas, redes o servicios.",
  ] },
  { title: "7. Disponibilidad y limitación de responsabilidad", paragraphs: [
    "La Corporación procura que el Portal esté disponible y actualizado, pero no garantiza su funcionamiento ininterrumpido, libre de errores o apto para una finalidad particular. Podrá modificar, suspender o terminar, total o parcialmente, el Portal y sus servicios cuando sea necesario y, cuando resulte razonable, procurará avisarlo previamente.",
    "En la medida permitida por la ley, la Corporación no será responsable por interrupciones, fallos de acceso, pérdida de información, virus u otros elementos que puedan afectar los equipos de las personas usuarias, ni por los contenidos, disponibilidad, legalidad o calidad de servicios ofrecidos por terceros. La persona usuaria adopta las medidas de seguridad que considere apropiadas al navegar en Internet.",
  ] },
  { title: "8. Retiro de acceso y reclamaciones", paragraphs: [
    "La Corporación podrá denegar o retirar el acceso al Portal o a sus servicios, sin necesidad de aviso previo, a quienes incumplan estas condiciones o las condiciones particulares aplicables.",
    "Si considera que algún contenido del Portal vulnera derechos de propiedad intelectual, puede comunicarse con la Corporación mediante los canales de contacto publicados en este sitio. La solicitud deberá identificar a la persona reclamante, el derecho presuntamente afectado, el contenido y su ubicación, así como una declaración de la exactitud de la información aportada.",
  ] },
  { id: "datos", title: "9. Información que recopilamos", paragraphs: [
    "Podemos recopilar los datos que comparte voluntariamente al usar formularios, comunicarse con nosotros, realizar una donación, inscribirse en actividades o participar en programas. Estos datos pueden incluir nombre, correo electrónico, teléfono, ciudad, información necesaria para atender su solicitud y el contenido de sus mensajes.",
    "La entrega de información solicitada en determinados formularios puede ser necesaria para gestionar la actividad, servicio o solicitud correspondiente. Le informaremos cuando un dato sea obligatorio.",
  ] },
  { title: "10. Tratamiento de datos personales", paragraphs: [
    "Corporación Senderos de Esperanza, en calidad de responsable del tratamiento, protege los datos personales que recolecta a través de sus formularios, actividades, programas, donaciones y canales de comunicación. El tratamiento se realizará de acuerdo con la Ley 1581 de 2012, sus normas reglamentarias y las demás disposiciones aplicables en Colombia.",
    "Al proporcionar sus datos, la persona titular autoriza su tratamiento para las finalidades informadas en esta política y en el aviso de privacidad correspondiente. La autorización podrá obtenerse por medios físicos, electrónicos, verbales o mediante conductas inequívocas, cuando la ley lo permita.",
  ] },
  { title: "11. Responsable y canales de atención", paragraphs: [
    "El responsable del tratamiento es Corporación Senderos de Esperanza. Para consultas, reclamos, actualización, rectificación o supresión de datos personales, puede escribir a senderosdeesperanza1@gmail.com o utilizar el formulario de contacto disponible en este sitio web.",
  ] },
  { title: "12. Finalidades y uso de datos personales", paragraphs: [
    "Tratamos los datos personales para responder consultas, gestionar inscripciones, donaciones y actividades, mantener comunicaciones relacionadas con los servicios solicitados, cumplir obligaciones legales y administrativas, mejorar el funcionamiento del Portal y elaborar información estadística agregada.",
    "Solo enviaremos comunicaciones promocionales o informativas cuando contemos con la autorización requerida. No vendemos ni alquilamos datos personales. Podremos compartir información con proveedores que nos ayuden a prestar un servicio, bajo deberes de confidencialidad y seguridad, o cuando una autoridad competente lo exija.",
  ] },
  { title: "13. Datos sensibles y datos de niños, niñas y adolescentes", paragraphs: [
    "No solicitamos datos sensibles salvo cuando sean estrictamente necesarios, exista una autorización explícita o una obligación legal. Los datos sensibles incluyen, entre otros, aquellos relacionados con salud, origen étnico, creencias, orientación política, vida sexual o información biométrica.",
    "Cuando se traten datos de niños, niñas o adolescentes, se protegerá su interés superior y sus derechos fundamentales. La Corporación solicitará la autorización de su representante legal cuando sea requerida y limitará el tratamiento a finalidades legítimas, pertinentes y necesarias.",
  ] },
  { title: "14. Cookies y tecnologías similares", paragraphs: [
    "El Portal puede utilizar cookies y tecnologías similares para recordar preferencias, facilitar la navegación, mejorar los servicios y obtener métricas de uso. Estas tecnologías pueden asociarse a un navegador o dispositivo y no necesariamente identifican directamente a una persona.",
    "Puede configurar su navegador para bloquear, limitar o avisar sobre las cookies. Deshabilitarlas podría afectar el funcionamiento de algunas secciones o servicios del Portal.",
  ] },
  { title: "15. Seguridad y conservación", paragraphs: [
    "Adoptamos medidas técnicas, administrativas y organizativas razonables para proteger la información contra acceso, pérdida, alteración, uso o divulgación no autorizados. Ninguna transmisión o almacenamiento por Internet es completamente seguro, por lo que no podemos garantizar seguridad absoluta.",
    "Conservamos la información durante el tiempo necesario para cumplir las finalidades descritas, atender obligaciones legales, contractuales o contables y resolver eventuales reclamaciones.",
  ] },
  { title: "16. Derechos de los titulares", paragraphs: [
    "De acuerdo con la normativa aplicable, puede solicitar conocer, acceder, actualizar, rectificar o suprimir sus datos personales, revocar una autorización cuando proceda y presentar consultas o reclamos sobre su tratamiento. Para ejercer estos derechos, comuníquese con la Corporación a través de los canales de contacto publicados en el Portal.",
  ] },
  { title: "17. Consultas, reclamos y revocatoria", paragraphs: [
    "La persona titular puede presentar consultas, solicitudes de actualización o rectificación, reclamos, solicitudes de supresión o revocatoria de la autorización por medio de los canales de contacto publicados en este sitio web. La Corporación atenderá cada solicitud dentro de los plazos y procedimientos establecidos por la normativa aplicable.",
    "La revocatoria o supresión no procederá cuando exista un deber legal o contractual de conservar la información. Si considera que sus derechos no han sido atendidos, puede acudir ante la Superintendencia de Industria y Comercio, conforme a los requisitos legales.",
  ] },
  { title: "18. Vigencia y cambios a esta política", paragraphs: [
    "Podemos actualizar estas condiciones y esta política cuando sea necesario. La versión vigente estará disponible en esta página. El uso continuado del Portal después de la publicación de cambios constituye la aceptación de la versión actualizada, en la medida permitida por la ley.",
  ] },
  { title: "19. Ley aplicable", paragraphs: [
    "Estas condiciones y la política de tratamiento de datos personales se rigen por las leyes aplicables de la República de Colombia, incluida la normativa de protección de datos personales. Cualquier controversia se someterá a las autoridades competentes conforme a la legislación aplicable.",
  ] },
];

const TERMS_COUNT = 8; // secciones 1-8: términos de uso; 9-19: privacidad y datos personales

function parse(section: LegalSection) {
  const match = section.title.match(/^(\d+)\.\s*(.*)$/);
  const number = match?.[1] ?? "";
  return {
    ...section,
    number,
    heading: match?.[2] ?? section.title,
    anchor: section.id ?? `seccion-${number}`,
  };
}

const parsed = terms.map(parse);
const parts = [
  {
    key: "terminos-de-uso",
    label: "Parte I",
    title: "Términos y condiciones de uso",
    intro: "Reglas que rigen el acceso y uso de este sitio web y de nuestros canales de comunicación.",
    icon: FileText,
    sections: parsed.slice(0, TERMS_COUNT),
  },
  {
    key: "privacidad",
    label: "Parte II",
    title: "Política de privacidad y tratamiento de datos",
    intro: "Cómo recolectamos, usamos, protegemos y gestionamos sus datos personales.",
    icon: ShieldCheck,
    sections: parsed.slice(TERMS_COUNT),
  },
];

const tocGroups: TocGroup[] = parts.map((part) => ({
  label: `${part.label} · ${part.title}`,
  items: part.sections.map((s) => ({ id: s.anchor, number: s.number, title: s.heading })),
}));

const highlights = [
  { icon: HeartHandshake, title: "No vendemos sus datos", text: "Jamás vendemos ni alquilamos información personal." },
  { icon: UserCheck, title: "Usted decide", text: "Puede conocer, actualizar, rectificar o suprimir sus datos." },
  { icon: Lock, title: "Información protegida", text: "Aplicamos medidas técnicas y administrativas de seguridad." },
  { icon: Scale, title: "Marco legal", text: "Cumplimos la Ley 1581 de 2012 y su normativa reglamentaria." },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f5f9f6]">
      {/* Encabezado */}
      <header className="relative overflow-hidden border-b-4 border-[#f4c542] bg-gradient-to-br from-[#1b5e20] via-[#2e7d32] to-[#1b5e20] pb-16 pt-32 text-white sm:pb-20 sm:pt-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#f4c542]/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#f4c542] ring-1 ring-white/20">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Documento legal
          </p>
          <h1 className="mt-5 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Política, Términos y Condiciones
          </h1>
          <p className="mt-3 text-lg font-semibold text-[#f4c542] sm:text-xl">Corporación Senderos de Esperanza</p>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/85 sm:text-lg">
            Explicamos con claridad las reglas de uso de este sitio y cómo cuidamos los datos personales de quienes nos
            contactan, donan o participan en nuestros programas.
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#f4c542]" aria-hidden="true" />
              <dt className="sr-only">Última actualización</dt>
              <dd>Actualizado: septiembre de 2026</dd>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-[#f4c542]" aria-hidden="true" />
              <dt className="sr-only">Normativa</dt>
              <dd>Ley 1581 de 2012 · Colombia</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            {parts.map((part) => (
              <a
                key={part.key}
                href={`#${part.sections[0].anchor}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1b5e20] shadow-sm transition-colors hover:bg-[#f4c542] hover:text-[#1f2430] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <part.icon className="h-4 w-4" aria-hidden="true" />
                {part.title}
              </a>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:pb-28">
        {/* Resumen */}
        <section aria-labelledby="resumen" className="relative z-10 -mt-10">
          <h2 id="resumen" className="sr-only">Resumen de nuestros compromisos</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((item) => (
              <li key={item.title} className="rounded-2xl border border-[#cfe8d2] bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eafaf3] text-[#2e7d32]">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 font-bold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4a5650]">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <LegalToc groups={tocGroups} />
          </aside>

          <article className="min-w-0 space-y-16">
            {parts.map((part) => (
              <div key={part.key} className="space-y-6">
                <div className="flex items-start gap-4 border-b border-[#cfe8d2] pb-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2e7d32] text-white">
                    <part.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2e7d32]">{part.label}</p>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{part.title}</h2>
                    <p className="mt-1.5 text-[#4a5650]">{part.intro}</p>
                  </div>
                </div>

                {part.sections.map((section) => (
                  <section
                    key={section.anchor}
                    id={section.anchor}
                    className="scroll-mt-28 rounded-2xl border border-[#e3efe5] bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eafaf3] text-sm font-bold tabular-nums text-[#2e7d32]">
                        {section.number}
                      </span>
                      <h3 className="text-lg font-bold leading-snug text-[#1b5e20] sm:text-xl">{section.heading}</h3>
                    </div>
                    <div className="mt-4 space-y-3 text-[15px] leading-7 text-[#3f4a44] sm:pl-12 sm:text-base">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ))}

            {/* Contacto */}
            <aside
              aria-labelledby="contacto-legal"
              className="flex flex-col gap-6 rounded-2xl bg-[#1b5e20] p-8 text-white sm:p-10 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 id="contacto-legal" className="text-xl font-bold sm:text-2xl">¿Tiene preguntas sobre sus datos?</h2>
                <p className="mt-2 max-w-xl text-white/80">
                  Escríbanos para ejercer sus derechos como titular o resolver cualquier duda sobre este documento.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href="mailto:senderosdeesperanza1@gmail.com"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#f4c542] px-6 py-2.5 text-sm font-semibold text-[#1f2430] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  senderosdeesperanza1@gmail.com
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Ir al formulario de contacto
                </Link>
              </div>
            </aside>
          </article>
        </div>
      </div>
    </div>
  );
}
