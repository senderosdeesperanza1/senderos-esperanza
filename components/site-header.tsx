"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { DesktopDropdown, MobileAccordion, claseEnlaceNav } from "@/components/nav-dropdown";
import { enlaceDonar, esRutaActiva, menuPrincipal } from "@/components/navegacion";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú móvil al cambiar de página.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Cierra el menú móvil con la tecla Escape y bloquea el scroll de fondo mientras está abierto.
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-[#f4c542] bg-[#2e7d32] pt-[env(safe-area-inset-top)] shadow-md">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542]"
          aria-label="Ir al inicio"
        >
          <Image
            src="/logo senderos.png"
            alt="Logo Senderos de Esperanza"
            width={56}
            height={56}
            className="h-14 w-auto transition-transform duration-300 hover:scale-105"
          />
          <span className="max-w-[170px] text-xs font-bold leading-tight text-white min-[400px]:max-w-[220px] min-[400px]:text-sm sm:text-base">
            Corporación Senderos de Esperanza
          </span>
        </Link>

        {/* Navegación de escritorio */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
          {menuPrincipal.map((item) =>
            item.hijos ? (
              <DesktopDropdown key={item.href} menu={item} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={esRutaActiva(pathname, item.href) ? "page" : undefined}
                className={claseEnlaceNav(esRutaActiva(pathname, item.href))}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link
            href={enlaceDonar.href}
            onClick={() => sendGAEvent("event", "donar_click", { origen: "header_escritorio" })}
          >
            <Button className="rounded-full bg-[#f4c542] px-6 font-semibold text-[#1f2430] transition-transform duration-200 hover:scale-105 hover:bg-[#ffd75e]">
              {enlaceDonar.label}
            </Button>
          </Link>
        </nav>

        {/* Botón hamburguesa (móvil) */}
        <button
          type="button"
          className="relative z-50 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10 hover:text-[#f4c542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542] lg:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          aria-controls="menu-movil"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navegación móvil */}
      <div
        id="menu-movil"
        className={`fixed inset-x-0 bottom-0 top-(--header-offset) z-40 overflow-y-auto bg-[#2e7d32] transition-transform duration-300 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Navegación móvil"
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex h-full flex-col px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
          <div className="flex flex-col gap-1">
            {menuPrincipal.map((item, i) =>
              item.hijos ? (
                <MobileAccordion key={item.href} menu={item} onNavigate={() => setIsMenuOpen(false)} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={esRutaActiva(pathname, item.href) ? "page" : undefined}
                  className={`py-3 text-base font-medium transition-all hover:translate-x-1 hover:text-[#f4c542] ${
                    esRutaActiva(pathname, item.href) ? "text-[#f4c542]" : "text-white"
                  } ${i > 0 ? "border-t border-white/15" : ""}`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="mt-auto pt-6">
            <Link
              href={enlaceDonar.href}
              onClick={() => sendGAEvent("event", "donar_click", { origen: "header_movil" })}
            >
              <Button className="w-full rounded-full bg-[#f4c542] py-6 text-base font-semibold text-[#1f2430] hover:bg-[#ffd75e]">
                {enlaceDonar.label}
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
