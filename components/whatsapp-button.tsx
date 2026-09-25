"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { sitio } from "@/components/navegacion";

const MENSAJE = "Hola, visité tu página web y necesito más información.";

/** Botón flotante de WhatsApp. Se oculta cuando el footer entra en pantalla para no taparlo. */
export function WhatsAppButton() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      // El footer cuenta como "visible" solo cuando ya subió más de 100 px desde el borde inferior;
      // así el botón no desaparece en el inicio, donde el footer asoma apenas carga la página.
      { threshold: 0, rootMargin: "0px 0px -100px 0px" },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={`https://wa.me/${sitio.contacto.whatsapp}?text=${encodeURIComponent(MENSAJE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp (se abre en una pestaña nueva)"
      onClick={() => sendGAEvent("event", "whatsapp_click", { origen: "boton_flotante" })}
      className={`group fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4c542] sm:bottom-[calc(2rem+env(safe-area-inset-bottom))] sm:right-[calc(2rem+env(safe-area-inset-right))] sm:h-16 sm:w-16 ${
        isFooterVisible ? "pointer-events-none translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <span
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 motion-reduce:hidden"
        aria-hidden="true"
      />
      <Image src="/whatsapp.png" alt="" width={34} height={34} className="h-8 w-8 sm:h-[34px] sm:w-[34px]" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#1f2430] px-3 py-1.5 text-sm font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
        Escríbenos por WhatsApp
      </span>
    </a>
  );
}
