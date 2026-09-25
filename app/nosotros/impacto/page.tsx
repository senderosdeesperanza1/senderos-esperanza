import type { Metadata } from "next";
import { ImpactoSection } from "@/components/nosotros/impacto-section";

export const metadata: Metadata = {
  title: "Impacto",
  description:
    "Cifras y resultados del trabajo de Senderos de Esperanza con niñas, niños, jóvenes y familias en Bogotá.",
  alternates: { canonical: "/nosotros/impacto/" },
};

export default function ImpactoPage() {
  return (
    <div className="pt-(--header-offset)">
      <ImpactoSection />
    </div>
  );
}
