import type { Metadata } from "next";
import { TalleresSection } from "@/components/programas/talleres-section";

export const metadata: Metadata = {
  title: "Talleres",
  description:
    "Talleres de tiempo libre que fomentan la creatividad, el trabajo en equipo y la participación de niñas, niños y jóvenes.",
  alternates: { canonical: "/programas/talleres/" },
};

export default function TalleresPage() {
  return (
    <div className="pt-(--header-offset)">
      <TalleresSection />
    </div>
  );
}
