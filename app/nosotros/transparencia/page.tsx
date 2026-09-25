import type { Metadata } from "next";
import { TransparenciaSection } from "@/components/nosotros/transparencia-section";

export const metadata: Metadata = {
  title: "Transparencia",
  description:
    "Información pública y documentos de la Corporación Senderos de Esperanza: cuentas claras y confianza.",
  alternates: { canonical: "/nosotros/transparencia/" },
};

export default function TransparenciaPage() {
  return (
    <div className="pt-(--header-offset)">
      <TransparenciaSection />
    </div>
  );
}
