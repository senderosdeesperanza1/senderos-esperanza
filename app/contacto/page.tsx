import type { Metadata } from "next";
import { ContactoSection } from "@/components/contacto-section";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escríbenos o visítanos: dirección, teléfono, correo y horario de atención de la Corporación Senderos de Esperanza en Bogotá.",
  alternates: { canonical: "/contacto/" },
};

export default function ContactoPage() {
  return (
    <div className="pt-(--header-offset)">
      <ContactoSection />
    </div>
  );
}
