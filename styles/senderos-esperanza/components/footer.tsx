import Link from "next/link";
import { Facebook, Instagram, Youtube, Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2e7d32] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#f4c542]">
              Corporacion Senderos de Esperanza
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Desde 2007 trabajamos para crear oportunidades de desarrollo en
              comunidades vulnerables, construyendo senderos hacia un futuro
              mejor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#nosotros"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Programas
                </Link>
              </li>
              <li>
                <Link
                  href="#noticias"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  href="#galeria"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Galería
                </Link>
              </li>
              <li>
                <Link
                  href="#contacto"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Nuestros Programas */}
          <div>
            <h4 className="font-bold mb-4">Nuestros Programas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Educación
                </Link>
              </li>
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Seguridad Alimentaria
                </Link>
              </li>
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Desarrollo Comunitario
                </Link>
              </li>
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Salud y Bienestar
                </Link>
              </li>
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Arte y Cultura
                </Link>
              </li>
              <li>
                <Link
                  href="#programas"
                  className="hover:text-[#f4c542] transition-colors"
                >
                  Deporte y Recreación
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/groups/599283016606733"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f4c542] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/corporacionsenderosdeesperanza/"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f4c542] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://vm.tiktok.com/ZSHWhnnLxPVnV-lmOgP/"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f4c542] flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <Music size={20} />
              </a>
              <a
                href="https://www.youtube.com/@SenderosdeEsperanza-v1m"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#f4c542] flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
          <p>
            © 2025 Corporación Senderos de Esperanza. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
