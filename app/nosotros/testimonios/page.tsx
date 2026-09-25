import type { Metadata } from "next";
import { TestimoniosSection } from "@/components/nosotros/testimonios-section";

export const metadata: Metadata = {
  title: "Testimonios",
  description:
    "Historias en video de las familias y los niños que hacen parte de Senderos de Esperanza.",
  alternates: { canonical: "/nosotros/testimonios/" },
};

export default function TestimoniosPage() {
  return (
    <TestimoniosSection />
  );
}
