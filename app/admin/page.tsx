"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Users, FileText, Activity, Calendar, Image as ImageIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  date: string;
  color: string;
  href: string;
};

function relativeTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "Hace unos segundos";
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
  if (seconds < 2592000) return `Hace ${Math.floor(seconds / 86400)} días`;
  return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalDonaciones: 0,
    donacionesMes: 0,
    totalVoluntarios: 0,
    voluntariosActivos: 0,
    totalNoticias: 0,
    totalFotos: 0,
    totalUsuarios: 0,
    usuariosActivos: 0,
  });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [donacionesRes, voluntariosRes, noticiasRes, galeriaRes, usuariosRes] =
          await Promise.all([
            fetch("/api/donaciones"),
            fetch("/api/voluntarios"),
            fetch("/api/noticias"),
            fetch("/api/galeria"),
            fetch("/api/usuarios"),
          ]);

        // Verificamos si la respuesta es exitosa antes de convertir a JSON
        // Si falla, usamos un array vacío para no romper el dashboard
        const donaciones = donacionesRes.ok ? await donacionesRes.json() : [];
        const voluntarios = voluntariosRes.ok  ? await voluntariosRes.json(): [];
        const noticias = noticiasRes.ok ? await noticiasRes.json() : [];
        const galeria = galeriaRes.ok ? await galeriaRes.json() : [];
        const usuarios = usuariosRes.ok ? await usuariosRes.json() : [];

        const safeArray = (value: unknown) => (Array.isArray(value) ? value : []);
        const activityItems: ActivityItem[] = [
          ...safeArray(noticias).map((item: any) => ({
            id: `noticia-${item.id || item.titulo}`,
            title: "Noticia publicada",
            detail: item.titulo || "Sin título",
            date: item.fecha,
            color: "bg-blue-500",
            href: "/admin/noticias",
          })),
          ...safeArray(galeria).map((item: any) => ({
            id: `galeria-${item.id || item.imagen}`,
            title: "Nueva foto en la galería",
            detail: "Imagen agregada a Firebase",
            date: item.fecha,
            color: "bg-amber-500",
            href: "/admin/galeria",
          })),
          ...safeArray(usuarios).map((item: any) => ({
            id: `usuario-${item.id || item.email}`,
            title: "Nuevo usuario registrado",
            detail: item.nombre || item.email || "Usuario",
            date: item.fechaCreacion,
            color: "bg-green-600",
            href: "/admin/usuarios",
          })),
          ...safeArray(voluntarios).map((item: any) => ({
            id: `voluntario-${item.id || item.email}`,
            title: "Nuevo voluntario registrado",
            detail: `${item.nombre || "Voluntario"} ${item.apellido || ""}`.trim(),
            date: item.fecha_creacion,
            color: "bg-emerald-500",
            href: "/admin/voluntarios",
          })),
          ...safeArray(donaciones).map((item: any) => ({
            id: `donacion-${item.id || item.email}`,
            title: "Nueva donación recibida",
            detail: `$${Number(item.monto || 0).toLocaleString("es-CO")}`,
            date: item.fecha,
            color: "bg-orange-500",
            href: "/admin/donaciones",
          })),
        ]
          .filter((item) => item.date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6);

        setActivity(activityItems);
        setLastUpdated(new Date());

        const now = new Date();

        // Aseguramos que donaciones sea un array antes de filtrar
        const donacionesArray = Array.isArray(donaciones) ? donaciones : [];

        const thisMonth = donacionesArray.filter((d: any) => {
          const donationDate = new Date(d.fecha);
          return (
            donationDate.getMonth() === now.getMonth() &&
            donationDate.getFullYear() === now.getFullYear()
          );
        });

        setMetrics({
          totalDonaciones: donacionesArray.reduce(
            (sum: number, d: any) => sum + Number(d.monto || 0),
            0,
          ),
          donacionesMes: thisMonth.reduce(
            (sum: number, d: any) => sum + Number(d.monto || 0),
            0,
          ),
          totalVoluntarios: Array.isArray(voluntarios) ? voluntarios.length : 0,
          voluntariosActivos: Array.isArray(voluntarios)
            ? voluntarios.filter((v: any) => v.estado === "activo").length
            : 0,
          totalUsuarios: Array.isArray(usuarios) ? usuarios.length : 0,
          usuariosActivos: Array.isArray(usuarios)
            ? usuarios.filter((u: any) => u.estado === "activo").length
            : 0,  
          totalNoticias: Array.isArray(noticias) ? noticias.length : 0,
          totalFotos: Array.isArray(galeria) ? galeria.length : 0,
        });
      } catch (error) {
        console.log("[Dashboard] Error loading metrics:", error);
      }
    };

    loadMetrics();
    const refreshId = window.setInterval(loadMetrics, 15000);
    return () => window.clearInterval(refreshId);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2e7d32]">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600 mt-2">
          Resumen de actividades y métricas de la fundación
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Donaciones Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalDonaciones.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ${metrics.donacionesMes.toLocaleString()} este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voluntarios</CardTitle>
            <Users className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVoluntarios}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.voluntariosActivos} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Noticias
            </CardTitle>
            <FileText className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalNoticias}</div>
            <p className="text-xs text-gray-500 mt-1">Publicaciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Galería
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalFotos}</div>
            <p className="text-xs text-gray-500 mt-1">Fotos en Firebase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalUsuarios}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.usuariosActivos} activos
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Accesos rápidos */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Gestión Rápida</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/donaciones">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#2e7d32]" />
                  Gestión de Donaciones
                </CardTitle>
                <CardDescription>
                  Registro, seguimiento y reportes de donaciones
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/voluntarios">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#2e7d32]" />
                  Gestión de Voluntarios
                </CardTitle>
                <CardDescription>
                  Datos personales y asignaciones de voluntarios
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/noticias">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#2e7d32]" />
                  Gestión de Noticias
                </CardTitle>
                <CardDescription>
                  Publicaciones, eventos y actividades
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/galeria">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-l-4 border-l-[#2e7d32]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-[#2e7d32]" />
                  Gestión de Galería
                </CardTitle>
                <CardDescription>
                  Subir, organizar y eliminar fotos con Firebase
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/usuarios">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-[#2e7d32]" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>
                  Administración del personal y miembros
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

