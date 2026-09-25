"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { esRutaActiva, type EnlaceNav } from "@/components/navegacion";

/** Enlace de escritorio sobre fondo verde: blanco, y al pasar el mouse o estar activo se pone amarillo con subrayado animado. */
export const claseEnlaceNav = (activo: boolean) =>
  `relative py-1 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-[#f4c542] after:transition-transform after:duration-300 hover:text-[#f4c542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542] ${
    activo ? "text-[#f4c542] after:scale-x-100" : "text-white after:scale-x-0 hover:after:scale-x-100"
  }`;

/** Menú con subpáginas para escritorio: enlace directo + desplegable. */
export function DesktopDropdown({ menu }: { menu: EnlaceNav }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = esRutaActiva(pathname, menu.href);

  const open = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative" onMouseEnter={open} onMouseLeave={close}>
      <div className="flex items-center gap-1">
        <Link
          href={menu.href}
          aria-current={isActive ? "page" : undefined}
          className={claseEnlaceNav(isActive)}
        >
          {menu.label}
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded p-1 text-white/80 transition-colors hover:text-[#f4c542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542]"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`Ver subpáginas de ${menu.label}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-3 w-64 rounded-xl border-t-4 border-[#f4c542] bg-white p-2 shadow-xl">
          {(menu.hijos ?? []).map((item) => {
            const itemActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={itemActive ? "page" : undefined}
                className={`block rounded-lg px-4 py-2.5 text-sm transition-colors hover:translate-x-1 hover:bg-[#fff6d6] hover:text-[#1b5e20] ${
                  itemActive ? "bg-[#fff6d6] font-semibold text-[#1b5e20]" : "text-[#1f2430]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Submenú expandible dentro del menú hamburguesa móvil. */
export function MobileAccordion({
  menu,
  onNavigate,
}: {
  menu: EnlaceNav;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = esRutaActiva(pathname, menu.href);

  return (
    <div className="border-t border-white/15 pt-3 first:border-0 first:pt-0">
      <div className="flex items-center justify-between py-2">
        <Link
          href={menu.href}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
          className={`text-base font-medium transition-colors hover:text-[#f4c542] ${
            isActive ? "text-[#f4c542]" : "text-white"
          }`}
        >
          {menu.label}
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded p-1 text-white/80 hover:text-[#f4c542] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c542]"
          aria-expanded={isOpen}
          aria-label={`Alternar subpáginas de ${menu.label}`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 pb-2 pl-4">
          {(menu.hijos ?? []).map((item) => {
            const itemActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={itemActive ? "page" : undefined}
                className={`block py-2 text-sm transition-all hover:translate-x-1 hover:text-[#f4c542] ${
                  itemActive ? "font-semibold text-[#f4c542]" : "text-white/85"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
