import type { Metadata } from "next";
import { Home } from "@/components/home";
import { sitio } from "@/components/navegacion";

const SITE_URL = "https://senderosdeesperanza.com";

export const metadata: Metadata = {
  // 53 caracteres: dentro del límite de 60 que suele mostrar Google en el buscador.
  title: { absolute: "Educación y niñez en Bogotá | Senderos de Esperanza" },
  description:
    "Corporación Senderos de Esperanza: educación, seguridad alimentaria y bienestar para niñas, niños y jóvenes de 1 a 18 años y sus familias en Bogotá.",
  alternates: { canonical: "/" },
};

// JSON-LD (Schema.org) tipo NGO para la portada: ayuda a Google a mostrar el nombre,
// el logo y las redes sociales en el panel de conocimiento y en resultados enriquecidos.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: sitio.nombre,
  alternateName: sitio.nombreCorto,
  url: SITE_URL,
  logo: `${SITE_URL}/logo%20senderos.png`,
  description: sitio.descripcion,
  taxID: sitio.nit,
  email: sitio.contacto.correo,
  telephone: sitio.contacto.telefono,
  address: {
    "@type": "PostalAddress",
    streetAddress: sitio.contacto.direccion,
    addressLocality: "Bogotá",
    addressCountry: "CO",
  },
  sameAs: sitio.redes.map((red) => red.href),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
    </>
  );
}
