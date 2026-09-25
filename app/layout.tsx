import type React from "react";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import "./globals.css";

const SITE_URL = "https://senderosdeesperanza.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Corporación Senderos de Esperanza",
    template: "%s | Senderos de Esperanza",
  },
  description:
    "Corporación sin ánimo de lucro en Bogotá que trabaja con niñas, niños y jóvenes de 1 a 18 años y sus familias en educación, seguridad alimentaria y bienestar.",
  keywords: [
    "ONG Bogotá",
    "fundación niños Bogotá",
    "corporación sin ánimo de lucro",
    "educación infantil Bogotá",
    "seguridad alimentaria Bogotá",
    "donaciones ONG Bogotá",
    "voluntariado Bogotá",
  ],
  // En Search Console, elige "Etiqueta HTML" como método de verificación y pega
  // el valor del atributo content en la variable de entorno GOOGLE_SITE_VERIFICATION.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Senderos de Esperanza",
    images: [
      {
        url: "/logo%20senderos.png",
        width: 512,
        height: 512,
        alt: "Logo de la Corporación Senderos de Esperanza",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo%20senderos.png"],
  },
};

// viewportFit "cover" habilita las variables env(safe-area-inset-*) para el notch
// y el home indicator de iPhone; sin esto, el header/footer fijos y el botón de
// WhatsApp no reciben el padding de área segura.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </div>
        <WhatsAppButton />
        <Analytics />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
