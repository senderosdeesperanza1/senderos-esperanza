"use client";

import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");

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
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) return;

      const user = JSON.parse(userRaw);
      if (user?.nombre) {
        setUserName(user.nombre);
      }
    } catch (error) {
      console.error("Error al cargar nombre de usuario:", error);
    }
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        {/* Header Móvil */}
        <header className="lg:hidden bg-[#2e7d32] text-white p-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <span className="font-bold text-lg tracking-tight">
              Panel Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            {userName && (
              <span className="text-sm font-medium text-white/95 max-w-[140px] truncate">
                {userName}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Overlay para móvil */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Header del Sidebar (Logo) */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onClick={() => setSidebarOpen(false)}
            >
              <div className="relative h-10 w-10 transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#2e7d32] leading-tight">
                  Senderos de
                </span>
                <span className="text-sm font-bold text-[#f4c542] leading-tight">
                  Esperanza
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Menu Principal
            </p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-[#2e7d32]/10 text-[#2e7d32]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-[#2e7d32]" />
                  )}
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-[#2e7d32]"
                        : "text-gray-400 group-hover:text-gray-600",
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer del Sidebar */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:shadow-sm transition-all"
              >
                <Home className="h-4 w-4" />
                <span>Ver Sitio Web</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 w-full min-w-0 bg-gray-50/50">
          <div className="hidden lg:flex items-center justify-end gap-2 h-16 px-8 border-b border-gray-200 bg-white sticky top-0 z-30">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sesión:</span>
            <span className="text-sm font-semibold text-gray-800">
              {userName || "Usuario"}
            </span>
          </div>
          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
