"use client";

import Image from "next/image";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Youtube,
} from "lucide-react";
import {
  enlacePrivacidad,
  sitio,
} from "@/components/navegacion";

function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

const iconosRedes: Record<string, typeof Facebook> = {
  Facebook,
  Instagram,
  TikTok: Music,
  YouTube: Youtube,
};

const enlace =
  "inline-block rounded-sm transition-colors duration-200 hover:text-[#f4c542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b5e20]";

const titulo = "text-sm font-semibold uppercase tracking-wider text-[#f4c542]";

const MENSAJE_WHATSAPP = "Hola, visité tu página web y necesito más información.";

const enlacesLegales = [enlacePrivacidad];

export function SiteFooter() {
  const { direccion, telefono, correo, whatsapp } = sitio.contacto;
  const anio = new Date().getFullYear();
  const web = sitio.web.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <footer className="border-t-4 border-[#f4c542] bg-[#1b5e20] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr]">
        {/* Marca */}
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir al inicio">
            <Image src="/logo senderos.png" alt="" width={56} height={56} className="h-14 w-auto" />
            <span className="text-lg font-bold leading-tight text-white">{sitio.nombre}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{sitio.descripcion}</p>
          {sitio.nit && <p className="mt-3 text-sm font-medium text-white">NIT {sitio.nit}</p>}
          <ul className="mt-5 flex gap-3">
            {sitio.redes.map((red) => {
              const Icono = iconosRedes[red.label];
              return (
                <li key={red.label}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${red.label} (se abre en una pestaña nueva)`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#f4c542] hover:text-[#1f2430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b5e20]"
                  >
                    {Icono && <Icono className="h-5 w-5" aria-hidden="true" />}
                  </a>
                </li>
              );
            })}
            {whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(MENSAJE_WHATSAPP)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp (se abre en una pestaña nueva)"
                  onClick={() => sendGAEvent("event", "whatsapp_click", { origen: "footer" })}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:-translate-y-1 hover:bg-[#25D366] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b5e20]"
                >
                  <IconoWhatsApp className="h-5 w-5" />
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h2 className={titulo}>Contacto</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {direccion && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#f4c542]" aria-hidden="true" />
                <span>{direccion}</span>
              </li>
            )}
            {telefono && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#f4c542]" aria-hidden="true" />
                <a href={`tel:${telefono.replace(/\s/g, "")}`} className={enlace}>
                  {telefono}
                </a>
              </li>
            )}
            {whatsapp && (
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f4c542]" aria-hidden="true" />
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendGAEvent("event", "whatsapp_click", { origen: "footer_contacto" })}
                  className={enlace}
                >
                  Escríbenos por WhatsApp
                </a>
              </li>
            )}
            {correo && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#f4c542]" aria-hidden="true" />
                <a href={`mailto:${correo}`} className={`${enlace} [overflow-wrap:anywhere]`}>
                  {correo}
                </a>
              </li>
            )}
            {web && (
              <li className="flex gap-3">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-[#f4c542]" aria-hidden="true" />
                <a href={`https://${web}`} target="_blank" rel="noopener noreferrer" className={enlace}>
                  {web}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/15 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {anio} {sitio.nombre}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {enlacesLegales.map((item, i) => (
              <li key={item.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <Link href={item.href} className={enlace}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
