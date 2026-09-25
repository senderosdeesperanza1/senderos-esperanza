import {
  GraduationCap,
  Apple,
  HeartHandshake,
  Palette,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export interface EnlaceNav {
  href: string;
  label: string;
  descripcion?: string;
  icono?: LucideIcon;
  imagen?: string;
  hijos?: EnlaceNav[];
}

export const sitio = {
  nombre: "Corporación Senderos de Esperanza",
  nombreCorto: "Senderos de Esperanza",
  nit: "900216738-1",
  // Dirección de la página web, tal como se muestra en el footer (ej. "www.tudominio.org"). Vacío = no se muestra.
  web: "",
  descripcion:
    "Corporación sin ánimo de lucro que trabaja con niñas, niños y jóvenes de 1 a 18 años y sus familias en educación, seguridad alimentaria y bienestar.",
  contacto: {
    direccion: "Carrera 93 B # 34 Sur-97, Bogotá, Colombia",
    telefono: "+57 3166852562",
    correo: "senderosdeesperanza1@gmail.com",
    whatsapp: "573023695873", // solo dígitos, con indicativo de país
  },
  redes: [
    { label: "Facebook", href: "https://www.facebook.com/share/17wnjUSYcS/" },
    { label: "Instagram", href: "https://www.instagram.com/corporacionsenderosdeesperanza/" },
    { label: "TikTok", href: "https://www.tiktok.com/@corporacion.senderos?_r=1&_t=ZS-93hTFSNFvUq" },
    { label: "YouTube", href: "https://www.youtube.com/@SenderosdeEsperanza-v1m" },
  ],
} as const;

export const programas: EnlaceNav[] = [
  {
    href: "/programas/educacion",
    imagen:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763481156/Educacion_za0hmb.jpg",
    label: "Educación",
    icono: GraduationCap,
    descripcion:
      "Apoyo académico, acompañamiento escolar y herramientas para que niñas, niños y jóvenes proyecten un futuro con más posibilidades.",
  },
  {
    href: "/programas/seguridad-alimentaria",
    imagen:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763496476/Seguridad_Alimentaria_iclucz.jpg",
    label: "Seguridad alimentaria",
    icono: Apple,
    descripcion:
      "Apoyo directo y acompañamiento nutricional para garantizar alimentos sanos y suficientes a las familias.",
  },
  {
    href: "/programas/cuidado",
    imagen:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763496691/Salud_y_Bienestar_wkk1aw.jpg",
    label: "Cuidado",
    icono: HeartHandshake,
    descripcion:
      "Acompañamiento integral y cercano para el bienestar emocional y social de cada persona.",
  },
  {
    href: "/programas/talleres",
    imagen:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763496765/Arte_y_Cultura_ugwutm.jpg",
    label: "Talleres",
    icono: Palette,
    descripcion:
      "Espacios de tiempo libre con aprendizaje que fomentan la creatividad, el trabajo en equipo y la participación.",
  },
  {
    href: "/programas/terremoto",
    imagen:
      "https://res.cloudinary.com/dqyhxdeyg/image/upload/v1763481537/Desarrollo_Comunitario_adnhia.jpg",
    label: "Terremoto",
    icono: LifeBuoy,
    descripcion:
      "Respuesta comunitaria ante la emergencia: apoyo humanitario, cuidado y reconstrucción con esperanza.",
  },
];

export const menuPrincipal: EnlaceNav[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/nosotros",
    label: "Nosotros",
    hijos: [
      { href: "/nosotros", label: "Sobre nosotros" },
      { href: "/nosotros/impacto", label: "Impacto" },
      { href: "/nosotros/opiniones", label: "Opiniones" },
      { href: "/nosotros/testimonios", label: "Testimonios" },
      { href: "/nosotros/transparencia", label: "Transparencia" },
    ],
  },
  {
    href: "/programas",
    label: "Programas",
    hijos: [{ href: "/programas", label: "Todos los programas" }, ...programas],
  },
  { href: "/contacto", label: "Contacto" },
];

export const enlaceDonar: EnlaceNav = { href: "/donar", label: "Donar" };

export const enlacePrivacidad: EnlaceNav = {
  href: "/privacy-policy",
  label: "Política, Términos y Condiciones",
};

export function esRutaActiva(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
