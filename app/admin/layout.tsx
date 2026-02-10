"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Activity,
  FileText,
  UserCog,
  Menu,
  X,
  Home,
  LogOut,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/donaciones", icon: DollarSign, label: "Donaciones" },
    { href: "/admin/voluntarios", icon: Users, label: "Voluntarios" },
    { href: "/admin/programas", icon: Activity, label: "Programas" },
    { href: "/admin/beneficiarios", icon: FolderOpen, label: "Beneficiarios" },
    { href: "/admin/noticias", icon: FileText, label: "Noticias" },
    { href: "/admin/usuarios", icon: UserCog, label: "Usuarios" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header móvil */}
        <div className="lg:hidden bg-[#2e7d32] text-white p-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
            <h1 className="font-bold text-lg">Panel Admin</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200
              transition-transform duration-300 ease-in-out
              ${
                sidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              }
            `}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="p-6 border-b border-gray-200">
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
                  <span className="text-lg sm:text-xl font-bold text-[#2e7d32]">
                    Senderos de Esperanza
                  </span>
                </Link>
              </div>

              {/* Navegación */}
              <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-[#2e7d32] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer del sidebar */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Sitio Público</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay móvil */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Contenido principal */}
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
