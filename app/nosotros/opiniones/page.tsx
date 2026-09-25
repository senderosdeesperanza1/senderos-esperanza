import type { Metadata } from "next";
import { OpinionesSection } from "@/components/nosotros/opiniones-section";

export const metadata: Metadata = {
  title: "Opiniones",
  description: "Lo que dicen las personas sobre la Corporación Senderos de Esperanza.",
  alternates: { canonical: "/nosotros/opiniones/" },
};

export default function OpinionesPage() {
  return (
    <div className="pt-(--header-offset)">
      <OpinionesSection />
    </div>
  );
}
