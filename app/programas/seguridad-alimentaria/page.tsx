import type { Metadata } from "next";
import { SeguridadAlimentariaSection } from "@/components/programas/seguridad-alimentaria-section";

export const metadata: Metadata = {
  title: "Seguridad alimentaria",
  description:
    "Programa de seguridad alimentaria: apoyo directo y acompañamiento nutricional para que las familias accedan a alimentos sanos y suficientes.",
  alternates: { canonical: "/programas/seguridad-alimentaria/" },
};

export default function SeguridadAlimentariaPage() {
  return (
    <div className="pt-(--header-offset)">
      <SeguridadAlimentariaSection />
    </div>
  );
}
