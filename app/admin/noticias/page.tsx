"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, ArrowLeft, LogOut } from "lucide-react";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function AdminNoticiasContent() {
  const router = useRouter();
  const { data: noticias = [], isLoading } = useSWR("/api/noticias", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState<any>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "publicacion",
    fecha: new Date().toISOString().split("T")[0],
    imagen: "",
    contenido: "",
  });

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const [userName, setUserName] = useState("");

  useState(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.nombre);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingNoticia) {
        // Update existing noticia
        await fetch(`/api/noticias/${editingNoticia.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new noticia
        await fetch("/api/noticias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      // Refresh data
      mutate("/api/noticias");

      // Reset form
      setFormData({
        titulo: "",
        descripcion: "",
        categoria: "publicacion",
        fecha: "",
        imagen: "",
        contenido: "",
      });
      setEditingNoticia(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error("[v0] Error saving noticia:", error);
      alert("Error al guardar la noticia");
    }
  };

  const handleEdit = (noticia: any) => {
    setEditingNoticia(noticia);
    setFormData({
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      categoria: noticia.categoria,
      fecha: noticia.fecha.split("T")[0], // Extrae solo la fecha para el input
      imagen: noticia.imagen,
      contenido: noticia.contenido || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta noticia?")) return;

    try {
      await fetch(`/api/noticias/${id}`, {
        method: "DELETE",
      });
      mutate("/api/noticias");
    } catch (error) {
      console.error("[v0] Error deleting noticia:", error);
      alert("Error al eliminar la noticia");
    }
  };

  const getCategoryLabel = (categoria: string) => {
    switch (categoria) {
      case "publicacion":
        return "Publicación";
      case "evento":
        return "Evento";
      case "actividad":
        return "Actividad";
      default:
        return categoria;
    }
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "publicacion":
        return "bg-blue-500";
      case "evento":
        return "bg-[#2e7d32]";
      case "actividad":
        return "bg-[#f4c542]";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    // Muestra la fecha en un formato legible para la zona horaria de Bogotá
    return new Date(isoDate).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Bogota",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Administrar Noticias</h1>
              {userName && (
                <p className="text-sm text-muted-foreground mt-1">
                  Bienvenido, {userName}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setIsFormOpen(true);
                setEditingNoticia(null);
                setFormData({
                  titulo: "",
                  descripcion: "",
                  categoria: "publicacion",
                  fecha: new Date().toISOString().split("T")[0],
                  imagen: "",
                  contenido: "",
                });
              }}
              className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Noticia
            </Button>
          </div>
        </div>

        {isFormOpen && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingNoticia ? "Editar Noticia" : "Nueva Noticia"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título *</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) =>
                        setFormData({ ...formData, titulo: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoria: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publicacion">Publicación</SelectItem>
                        <SelectItem value="evento">Evento</SelectItem>
                        <SelectItem value="actividad">Actividad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagen">URL de Imagen</Label>
                    <Input
                      id="imagen"
                      value={formData.imagen}
                      onChange={(e) =>
                        setFormData({ ...formData, imagen: e.target.value })
                      }
                      placeholder="/ruta/a/imagen.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción Corta *</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contenido">Contenido Completo</Label>
                  <Textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) =>
                      setFormData({ ...formData, contenido: e.target.value })
                    }
                    rows={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
                  >
                    {editingNoticia ? "Actualizar" : "Crear"} Noticia
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingNoticia(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2e7d32]"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia: any) => (
              <Card key={noticia.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={
                      noticia.imagen || "/placeholder.svg?height=300&width=400"
                    }
                    alt={noticia.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-4 left-4 ${getCategoryColor(
                      noticia.categoria
                    )} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {getCategoryLabel(noticia.categoria)}
                  </div>
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(noticia.fecha)}
                  </p>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {noticia.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {noticia.descripcion}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(noticia)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(noticia.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && noticias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay noticias creadas aún.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Noticia
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminNoticiasPage() {
  return (
    <AuthGuard>
      <AdminNoticiasContent />
    </AuthGuard>
  );
}
