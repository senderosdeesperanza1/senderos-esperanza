import type { Metadata } from "next";
import { TerremotoSection } from "@/components/programas/terremoto-section";

export const metadata: Metadata = {
  title: "Terremoto",
  description:
    "Respuesta comunitaria ante el terremoto: apoyo humanitario, cuidado, seguimiento y reconstrucción con esperanza.",
  alternates: { canonical: "/programas/terremoto/" },
};

export default function TerremotoPage() {
  return (
    <div className="pt-(--header-offset)">
      <TerremotoSection />
    </div>
  );
}
