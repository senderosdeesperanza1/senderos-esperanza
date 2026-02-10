"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el menú si cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { href: "/", label: "Inicio" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#programas", label: "Programas" },
    { href: "#noticias", label: "Noticias" },
    { href: "#galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" },
  ];

  const isHomePage = pathname === "/";

  const getLinkHref = (href: string) => {
    if (href === "/") return "/";
    return isHomePage ? href : `/${href}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2e7d32] text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Ir al inicio"
          >
            <Image
              src="/logo.png"
              alt="Logo Senderos de Esperanza"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
            <span className="text-base sm:text-lg font-bold">
              Corporación Senderos de Esperanza
            </span>
          </Link>

          {/* Menú de escritorio */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={getLinkHref(item.href)}
                className="text-sm font-medium hover:text-[#f4c542] transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Botón de donación */}
            <Link href="/#donar">
              <Button className="bg-[#f4c542] text-[#2e7d32] hover:bg-[#f4c542]/90 font-semibold">
                Donar Ahora
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#2e7d32] bg-transparent"
              >
                Iniciar Sesión
              </Button>
            </Link>
          </nav>

          {/* Botón menú móvil */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-white/20 animate-slide-down">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={getLinkHref(item.href)}
                  className="text-sm font-medium hover:text-[#f4c542] transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Botón de donación móvil */}
              <Link href="/#donar" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-[#f4c542] text-[#2e7d32] hover:bg-[#f4c542]/90 font-semibold w-full">
                  Donar Ahora
                </Button>
              </Link>
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#2e7d32] bg-transparent w-full"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
