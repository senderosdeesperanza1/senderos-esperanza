import type { Metadata } from "next";
import { NosotrosSection } from "@/components/nosotros/nosotros-section";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, la misión, la visión y los valores de la Corporación Senderos de Esperanza, organización sin ánimo de lucro de Bogotá.",
  alternates: { canonical: "/nosotros/" },
};

export default function NosotrosPage() {
  return <NosotrosSection />;
}
