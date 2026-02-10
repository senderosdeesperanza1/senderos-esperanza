import Image from "next/image";
import { Heart, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <section id="nosotros" className="bg-background pt-20">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Conoce Nuestra Historia
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed drop-shadow">
            Senderos de Esperanza es una corporación sin ánimo de lucro dedicada
            a mejorar la calidad de vida de niños de 1 a 18 años de escasos
            recursos. Nuestra misión es brindarles esperanza y oportunidades
            para un futuro mejor.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
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
          <div className="relative w-64 h-64 mx-auto md:w-full md:h-80">
            <Image
              src="https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763480821/Zulma_nrgfma.jpg"
              alt="Zulma Mayoma, fundadora de Senderos de Esperanza"
              fill
              className="rounded-full shadow-lg object-cover"
            />
          </div>
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-4 text-[#2e7d32]">
              La Historia de Nuestra Fundadora: Zulma Mayoma
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
        {/* Video de Testimonio */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            <span className="text-[#2e7d32]">Historias que Inspiran</span>
          </h3>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl">
            <iframe
              className="w-full h-full"
              src="https://www.youtube-nocookie.com/embed/yCZ1LV6FtJ4?fs=0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
