import { Calendar, FileText, Users, type LucideIcon } from "lucide-react";

export interface NewsItem {
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
  content: string; // Contenido completo del artículo
  date: string;
  image: string;
  category: "publicacion" | "evento" | "actividad";
  slug: string;
}

export const news: NewsItem[] = [
  {
    type: "Publicación",
    icon: FileText,
    title: "Informe Anual 2024: Un Año de Transformación",
    description:
      "Conoce los logros y el impacto que hemos generado durante el último año en nuestras comunidades.",
    content:
      "Nuestro Informe Anual 2024 detalla un año de crecimiento y éxito sin precedentes. Gracias al apoyo de nuestros donantes y voluntarios, hemos podido expandir nuestros programas educativos, mejorar la seguridad alimentaria en cinco nuevas comunidades y lanzar iniciativas de salud que han beneficiado a más de 3,000 personas. Este documento no solo presenta cifras, sino también las historias humanas detrás de cada logro. Te invitamos a explorar cómo tu contribución está construyendo un futuro más brillante.",
    date: "15 de Enero, 2025",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1759164956/Carousel_2_dudgsx.jpg",
    category: "publicacion",
    slug: "informe-anual-2024",
  },
  {
    type: "Evento",
    icon: Calendar,
    title: "Jornada de Salud Comunitaria",
    description:
      "Únete a nuestra jornada gratuita de salud con atención médica, odontológica y nutricional para toda la familia.",
    content:
      "¡La salud es un derecho de todos! El próximo 28 de febrero, te esperamos en el parque principal para nuestra gran Jornada de Salud Comunitaria. Contaremos con especialistas en medicina general, odontología, pediatría y nutrición. Además, habrá puestos de vacunación, charlas sobre prevención de enfermedades y actividades recreativas para los más pequeños. No se requiere inscripción previa, ¡solo trae a tu familia y tus ganas de cuidarte!",
    date: "28 de Febrero, 2025",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1718849397/community-health-fair_b8qecj.jpg",
    category: "evento",
    slug: "jornada-salud-comunitaria",
  },
  {
    type: "Actividad",
    icon: Users,
    title: "Taller de Emprendimiento para Jóvenes",
    description:
      "Programa de formación en habilidades empresariales para jóvenes de 16 a 25 años. Inscripciones abiertas.",
    content:
      "¿Tienes una idea de negocio? En nuestro Taller de Emprendimiento para Jóvenes, te daremos las herramientas para convertirla en realidad. Durante 8 semanas, aprenderás sobre plan de negocios, marketing digital, finanzas y liderazgo. El programa es gratuito e incluye mentorías personalizadas con empresarios locales. Las inscripciones están abiertas hasta el 5 de marzo. ¡No dejes pasar esta oportunidad para forjar tu propio camino!",
    date: "10 de Marzo, 2025",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1718849397/youth-entrepreneurship-workshop_qdeixz.jpg",
    category: "actividad",
    slug: "taller-emprendimiento-jovenes",
  },
  {
    type: "Publicación",
    icon: FileText,
    title: "Historias de Éxito: Testimonios que Inspiran",
    description:
      "Lee las historias reales de personas que han transformado sus vidas gracias a nuestros programas.",
    content:
      "En nuestra más reciente publicación, 'Historias de Éxito', compilamos los testimonios de beneficiarios que, con el apoyo de Senderos de Esperanza, han superado adversidades y alcanzado sus sueños. Desde estudiantes que se convirtieron en profesionales hasta emprendedores que hoy generan empleo, cada historia es un recordatorio del poder de la solidaridad. Inspírate con sus viajes y descubre el impacto real de nuestra labor.",
    date: "5 de Febrero, 2025",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1718849397/success-stories-book_u9v3xj.jpg",
    category: "publicacion",
    slug: "historias-de-exito",
  },
  {
    type: "Evento",
    icon: Calendar,
    title: "Festival Deportivo Comunitario",
    description:
      "Celebremos juntos con torneos, actividades recreativas y premios para todas las edades.",
    content:
      "El deporte une y fortalece a la comunidad. Te invitamos al Festival Deportivo anual, un día lleno de energía y sana competencia. Habrá torneos de fútbol, baloncesto y voleibol, así como carreras de sacos, clases de zumba al aire libre y juegos tradicionales para toda la familia. La participación es gratuita y habrá premios para los ganadores y medallas para todos los niños. ¡Ven a mover el cuerpo y a compartir en comunidad!",
    date: "20 de Marzo, 2025",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1718849397/community-sports-festival_f58vxa.jpg",
    category: "evento",
    slug: "festival-deportivo-comunitario",
  },
  {
    type: "Actividad",
    icon: Users,
    title: "Programa de Alfabetización Digital",
    description:
      "Clases gratuitas de computación básica e internet para adultos mayores. Cupos limitados.",
    content:
      "La tecnología es para todos. Con nuestro nuevo Programa de Alfabetización Digital, queremos que nuestros adultos mayores se conecten con el mundo digital de forma segura y sencilla. Las clases cubrirán el uso básico de computadoras, navegación por internet, correo electrónico y redes sociales. Los cupos son limitados para garantizar una atención personalizada. ¡Inscríbete en la sede de la corporación y no te quedes atrás!",
    date: "1 de Marzo, 2025",
    image:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1718849396/digital-literacy-class-seniors_vjpyct.jpg",
    category: "actividad",
    slug: "alfabetizacion-digital-adultos",
  },
];
