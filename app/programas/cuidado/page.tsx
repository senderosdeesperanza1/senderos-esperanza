import type { Metadata } from "next";
import { CuidadoSection } from "@/components/programas/cuidado-section";

export const metadata: Metadata = {
  title: "Cuidado",
  description:
    "Programa de cuidado y acompañamiento integral para el bienestar emocional y social de niñas, niños, jóvenes y familias.",
  alternates: { canonical: "/programas/cuidado/" },
};

export default function CuidadoPage() {
  return (
    <div className="pt-(--header-offset)">
      <CuidadoSection />
    </div>
  );
}
