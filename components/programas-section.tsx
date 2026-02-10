import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProgramasSection() {
  const documentos = [
    {
      title: "Formato Inscripcion senderos",
      href: "https://drive.google.com/file/d/1bnWqx-DScXdNaOEUmWQ-bTTyLXda0KDL/view?usp=sharing",
    },
    {
      title: "Formato Uso Imagen Senderos",
      href: "https://drive.google.com/file/d/1NroS7OZ8VrBbiShXfaSTfhHzKlKA684Z/view?usp=sharing",
    },
  ];

  const programs = [
    {
      icon: "🎓",
      title: "Educación",
      description:
        "Fomentamos el aprendizaje y el desarrollo de habilidades en niños y niñas y jóvenes a través de tutorías, talleres creativos y acceso a herramientas digitales, preparándolos para un futuro exitoso.",
      image:
        "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763481156/Educacion_za0hmb.jpg",
    },
    {
      icon: "🍎",
      title: "Seguridad Alimentaria",
      description:
        "Garantizamos el acceso a una nutrición adecuada para las familias mediante la distribución de alimentos, la creación de huertos comunitarios y la educación sobre hábitos alimenticios saludables.",
      image:
        "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763496476/Seguridad_Alimentaria_iclucz.jpg",
    },
    {
      icon: "🏘️",
      title: "Desarrollo Comunitario",
      description:
        "Impulsamos la cohesión social y el empoderamiento de la comunidad a través de proyectos participativos, capacitaciones para el emprendimiento y la mejora de infraestructuras locales.",
      image:
        "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763481537/Desarrollo_Comunitario_adnhia.jpg",
    },
    {
      icon: "❤️‍🩹",
      title: "Salud y Bienestar",
      description:
        "Promovemos el bienestar físico y mental con jornadas de salud, apoyo psicosocial y actividades deportivas, asegurando un entorno saludable para el crecimiento de todos.",
      image:
        "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763496691/Salud_y_Bienestar_wkk1aw.jpg",
    },
    {
      icon: "🎨",
      title: "Arte y Cultura",
      description:
        "Estimulamos la creatividad y la expresión artística a través de talleres de pintura, música y teatro, talleres en trenzas africanas turbantes enriqueciendo el desarrollo cultural y personal de los participantes.",
      image:
        "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763496765/Arte_y_Cultura_ugwutm.jpg",
    },
    {
      icon: "⚽",
      title: "Deporte y Recreación",
      description:
        "Promovemos un estilo de vida activo y el trabajo en equipo con actividades deportivas y recreativas que fortalecen tanto el cuerpo como los lazos comunitarios.",
      image:
        "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763481721/Deporte_y_Recreaci%C3%B3n_zec3js.jpg",
    },
  ];

  return (
    <section id="programas" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-[#2e7d32]">Nuestros Programas</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Creemos en un enfoque integral para el desarrollo. Nuestros
            programas están diseñados para abordar las necesidades fundamentales
            de las comunidades a las que servimos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f4c542] text-3xl mb-2">
                    {program.icon}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{program.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {program.description}
                </p>
                <Button
                  variant="outline"
                  className="border-[#2e7d32] text-[#2e7d32] hover:bg-[#2e7d32] hover:text-white bg-transparent"
                >
                  Conocer Más
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex flex-col items-center text-center mb-8">
            <p className="text-sm uppercase tracking-[0.25em] text-[#2e7d32]/80">
              Documentos
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-[#2e7d32]">
              Documentacion y Convocatorias
            </h3>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Consulta los documentos oficiales en PDF para conocer los detalles
              de los programas y convocatorias vigentes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {documentos.map((doc, index) => (
              <div
                key={index}
                className="relative rounded-2xl bg-white shadow-lg border border-black/5"
              >
                <span className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl bg-[#2e7d32]" />
                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2e7d32] text-2xl text-white shadow-sm">
                      DOC
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-[#1f5a24]">
                        {doc.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Documento oficial en PDF
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-[#f4c542] text-[#1f5a24] hover:bg-[#f4c542]/90"
                    asChild
                  >
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver mas
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
