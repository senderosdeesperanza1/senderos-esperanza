"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, ChevronUp, FileText, Users } from "lucide-react";
import { useState } from "react";
// import useSWR from "swr";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getCategoryIcon = (categoria: string) => {
  switch (categoria) {
    case "publicacion":
      return FileText;
    case "evento":
      return Calendar;
    case "actividad":
      return Users;
    default:
      return FileText;
  }
};

const getCategoryLabel = (categoria: string) => {
  switch (categoria) {
    case "publicacion":
      return "Publicación";
    case "evento":
      return "Evento";
    case "actividad":
      return "Actividad";
    default:
      return "Noticia";
  }
};

const getCategoryColor = (categoria: string) => {
  switch (categoria) {
    case "publicacion":
      return "bg-blue-500";
    case "evento":
      return "bg-[#2e7d32]";
    case "actividad":
      return "bg-[#f4c542]";
    default:
      return "bg-gray-500";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function NoticiasSection() {
  // Datos de ejemplo para visualizar la sección correctamente
  const noticias = [
    {
      id: 1,
      titulo: "Jornada de Salud Comunitaria",
      descripcion:
        "Realizamos chequeos médicos gratuitos y vacunación para más de 200 familias en el sector norte.",
      fecha: "2024-03-15",
      categoria: "actividad",
      imagen: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      titulo: "Informe Anual de Impacto 2023",
      descripcion:
        "Ya está disponible nuestro reporte anual donde detallamos los logros y transparencia financiera.",
      fecha: "2024-02-28",
      categoria: "publicacion",
      imagen: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      titulo: "Gran Bazar Benéfico",
      descripcion:
        "Te invitamos a participar en nuestro bazar anual para recaudar fondos para el comedor infantil.",
      fecha: "2024-04-10",
      categoria: "evento",
      imagen: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 4,
      titulo: "Alianza con Universidad ECCI para Prácticas de Enfermería",
      descripcion:
        "Estudiantes de enfermería de la Universidad ECCI inician prácticas formativas en nuestra corporación, fortaleciendo la salud comunitaria. En el marco del convenio docencia servicio establecido entre la Universidad ECCI y el Banco de Alimentos de Bogotá, este mes se dio inicio a la práctica formativa de los estudiantes del programa de Enfermería, quienes en el curso de cuidado de enfermería al niño y al adolescente en el ámbito comunitario y con acompañamiento docente, realizarán sus prácticas en la Corporación Senderos de Esperanza, realizando actividades educativas y lúdicas dirigidas a los niños beneficiarios al igual que actividades de valoración de salud infantil individual y comunitaria, tamizajes de peso/talla, entre otras actividades.",
      fecha: "2025-11-10",
      categoria: "actividad",
      imagen: "/placeholder.svg?height=300&width=400",
    },
  ];
  const isLoading = false;
  const error = null;

  const stats = [
    { number: "15,000+", label: "Vidas Transformadas" },
    { number: "50+", label: "Comunidades Atendidas" },
    { number: "100+", label: "Proyectos Completados" },
    { number: "14", label: "Años de Experiencia" },
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Beneficiaria del Programa de Educación",
      quote:
        "Gracias a Senderos de Esperanza pude terminar mis estudios y ahora tengo un trabajo digno que me permite mantener a mi familia.",
      image: "/smiling-woman-portrait.png",
    },
    {
      name: "Carlos Ramírez",
      role: "Emprendedor",
      quote:
        "El programa de desarrollo económico me dio las herramientas para iniciar mi propio negocio. Hoy empleo a 5 personas de mi comunidad.",
      image: "/professional-man-portrait.png",
    },
  ];

  return (
    <section id="noticias" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            <span className="text-[#2e7d32]">Noticias</span>
          </h2>
          <p className="text-lg text-muted-foreground text-balance leading-relaxed">
            Mantente informado sobre nuestras publicaciones, eventos y
            actividades que transforman vidas y fortalecen comunidades.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#2e7d32] mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Historias de <span className="text-[#2e7d32]">Esperanza</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">
            Publicaciones, Eventos y{" "}
            <span className="text-[#2e7d32]">Actividades</span>
          </h3>
          <p className="text-center text-muted-foreground mb-12 text-balance leading-relaxed">
            Descubre nuestras últimas publicaciones, próximos eventos y
            actividades en curso.
          </p>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2e7d32]"></div>
              <p className="mt-4 text-muted-foreground">Cargando noticias...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">
                Error al cargar las noticias. Por favor, intenta de nuevo.
              </p>
            </div>
          )}

          {!isLoading && !error && noticias.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay noticias disponibles en este momento.
              </p>
            </div>
          )}

          {!isLoading && !error && noticias.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((noticia: any) => (
                <NewsCard key={noticia.id} noticia={noticia} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NewsCard({ noticia }: { noticia: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = getCategoryIcon(noticia.categoria);

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow overflow-hidden group flex flex-col">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={noticia.imagen || "/placeholder.svg?height=300&width=400"}
          alt={noticia.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute top-4 left-4 ${getCategoryColor(
            noticia.categoria
          )} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2`}
        >
          <Icon className="w-4 h-4" />
          {getCategoryLabel(noticia.categoria)}
        </div>
      </div>
      <CardContent className="pt-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="w-4 h-4" />
          {formatDate(noticia.fecha)}
        </div>
        <h4 className="font-bold text-lg mb-3 text-balance leading-tight">
          {noticia.titulo}
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {isExpanded
            ? noticia.descripcion
            : `${noticia.descripcion.substring(0, 120)}...`}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group mt-auto self-start inline-flex items-center gap-2 text-sm font-bold text-[#2e7d32] hover:text-[#1b5e20] transition-colors"
        >
          {isExpanded ? (
            <>
              Leer menos{" "}
              <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
            </>
          ) : (
            <>
              Leer más{" "}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </CardContent>
    </Card>
  );
}
