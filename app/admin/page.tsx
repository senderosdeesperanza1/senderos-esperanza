"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Users, FileText, Activity, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalDonaciones: 0,
    donacionesMes: 0,
    totalVoluntarios: 0,
    voluntariosActivos: 0,
    totalProgramas: 0,
    programasActivos: 0,
    totalNoticias: 0,
  });

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [donacionesRes, voluntariosRes, programasRes, noticiasRes] =
          await Promise.all([
            fetch("/api/donaciones"),
            fetch("/api/voluntarios"),
            fetch("/api/programas"),
            fetch("/api/noticias"),
          ]);

        const donaciones = await donacionesRes.json();
        const voluntarios = await voluntariosRes.json();
        const programas = await programasRes.json();
        const noticias = await noticiasRes.json();

        const now = new Date();
        const thisMonth = donaciones.filter((d: any) => {
          const donationDate = new Date(d.fecha);
          return (
            donationDate.getMonth() === now.getMonth() &&
            donationDate.getFullYear() === now.getFullYear()
          );
        });

        setMetrics({
          totalDonaciones: donaciones.reduce(
            (sum: number, d: any) => sum + d.monto,
            0
          ),
          donacionesMes: thisMonth.reduce(
            (sum: number, d: any) => sum + d.monto,
            0
          ),
          totalVoluntarios: voluntarios.length,
          voluntariosActivos: voluntarios.filter(
            (v: any) => v.estado === "activo"
          ).length,
          totalProgramas: programas.length,
          programasActivos: programas.filter((p: any) => p.activo).length,
          totalNoticias: noticias.length,
        });
      } catch (error) {
        console.log("[v0] Error loading metrics:", error);
      }
    };

    loadMetrics();
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
            <CardTitle className="text-sm font-medium">Programas</CardTitle>
            <Activity className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProgramas}</div>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.programasActivos} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Noticias Publicadas
            </CardTitle>
            <FileText className="h-4 w-4 text-[#2e7d32]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalNoticias}</div>
            <p className="text-xs text-gray-500 mt-1">Publicaciones totales</p>
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

          <Link href="/admin/programas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#2e7d32]" />
                  Gestión de Programas
                </CardTitle>
                <CardDescription>
                  Agregar, editar y eliminar proyectos sociales
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

          <Link href="/admin/usuarios">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#2e7d32]" />
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

      {/* Actividad reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#2e7d32]" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-[#2e7d32] rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Nueva donación recibida</p>
                <p className="text-sm text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-[#f4c542] rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Nuevo voluntario registrado</p>
                <p className="text-sm text-gray-500">Hace 5 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Noticia publicada</p>
                <p className="text-sm text-gray-500">Hace 1 día</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
