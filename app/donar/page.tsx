import type { Metadata } from "next";
import DonarSection from "@/components/donar-section";

export const metadata: Metadata = {
  title: "Donar",
  description:
    "Tu donación cambia la vida de un niño. Apoya la educación, la alimentación y el acompañamiento de niñas, niños y familias con Senderos de Esperanza.",
  alternates: { canonical: "/donar/" },
};

export default function DonarPage() {
  return (
    <div className="pt-(--header-offset)">
      <DonarSection />
    </div>
  );
}
