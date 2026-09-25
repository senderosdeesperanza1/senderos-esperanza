import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { sitio } from "@/components/navegacion";

export const metadata: Metadata = {
  title: "Gracias por tu donación",
  robots: { index: false },
  alternates: { canonical: "/donar/gracias/" },
};

export default function GraciasPage() {
  return (
    <div className="pt-(--header-offset)">
      <section className="bg-[#f5faf6] py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center ring-1 ring-[#dfeee0] md:p-12">
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#2e7d32]" aria-hidden="true" />
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#1f2430] md:text-4xl">
              ¡Gracias por tu aporte!
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Bold te enviará el comprobante de pago a tu correo. Si necesitas tu certificado de
              donación, escríbenos a{" "}
              <a className="font-semibold text-[#2e7d32] underline" href={`mailto:${sitio.contacto.correo}`}>
                {sitio.contacto.correo}
              </a>
              .
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#2e7d32] px-8 font-semibold text-white hover:bg-[#236126]"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
