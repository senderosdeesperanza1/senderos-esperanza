import type { Metadata } from "next";
import { EducacionSection } from "@/components/programas/educacion-section";

export const metadata: Metadata = {
  title: "Educación",
  description:
    "Programa de educación de Senderos de Esperanza: apoyo académico, acompañamiento escolar y herramientas para niñas, niños y jóvenes.",
  alternates: { canonical: "/programas/educacion/" },
};

export default function EducacionPage() {
  return (
    <div className="pt-(--header-offset)">
      <EducacionSection />
    </div>
  );
}
