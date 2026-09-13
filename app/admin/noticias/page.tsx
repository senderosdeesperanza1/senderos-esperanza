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
import { Plus, Edit, Trash2, ArrowLeft, Upload } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error([data?.error, data?.details].filter(Boolean).join(": ") || "No fue posible cargar las noticias");
  }
  if (!Array.isArray(data)) {
    throw new Error("La respuesta de noticias no tiene un formato válido");
  }

  return data;
};

const getLocalDate = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const parseCalendarDate = (value: string) => {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
};

function AdminNoticiasContent() {
  const router = useRouter();
  const { data: noticias = [], error, isLoading } = useSWR("/api/noticias", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState<any>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "publicacion",
    fecha: getLocalDate(),
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
      const response = editingNoticia
        ? await fetch(`/api/noticias/${editingNoticia.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        : await fetch("/api/noticias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          [data?.error, data?.details].filter(Boolean).join(": ") ||
            "No fue posible guardar la noticia",
        );
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
      toast.success(
        editingNoticia
          ? "Noticia actualizada correctamente"
          : "Noticia creada correctamente",
      );
    } catch (error) {
      console.error("[v0] Error saving noticia:", error);
      toast.error(error instanceof Error ? error.message : "Error al guardar la noticia");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen válido.");
      event.target.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("La imagen no puede superar 8 MB.");
      event.target.value = "";
      return;
    }

    setIsUploadingImage(true);
    try {
      const sourceUrl = URL.createObjectURL(file);
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const loadedImage = new Image();
        loadedImage.onload = () => resolve(loadedImage);
        loadedImage.onerror = () => reject(new Error("No fue posible leer la imagen."));
        loadedImage.src = sourceUrl;
      });
      URL.revokeObjectURL(sourceUrl);

      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

      const compressedImage = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("No fue posible procesar la imagen."))),
          "image/jpeg",
          0.75,
        );
      });
      if (compressedImage.size > 650 * 1024) {
        throw new Error("La imagen comprimida sigue siendo grande. Usa una imagen de menor tamaño.");
      }

      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("No fue posible preparar la imagen."));
        reader.readAsDataURL(compressedImage);
      });
      setFormData((current) => ({ ...current, imagen: imageUrl }));
      toast.success("Imagen preparada para guardar con la noticia.");
    } catch (error) {
      console.error("Error uploading noticia image:", error);
      const code = typeof error === "object" && error && "code" in error
        ? String(error.code)
        : null;
      toast.error(
        error instanceof Error && !code
          ? error.message
          : `No fue posible subir la imagen (${code || "error desconocido"}).`,
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
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
      const response = await fetch(`/api/noticias/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "No fue posible eliminar la noticia");
      }
      mutate("/api/noticias");
      toast.success("Noticia eliminada correctamente");
    } catch (error) {
      console.error("[v0] Error deleting noticia:", error);
      toast.error(error instanceof Error ? error.message : "Error al eliminar la noticia");
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
    return parseCalendarDate(isoDate).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
                  fecha: getLocalDate(),
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
                    <Label
                      htmlFor="archivo-imagen"
                      className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#2e7d32] hover:underline"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingImage
                        ? "Preparando imagen..."
                        : "Subir imagen desde el equipo"}
                    </Label>
                    <Input
                      id="archivo-imagen"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                    {formData.imagen && (
                      <img
                        src={formData.imagen}
                        alt="Vista previa de la noticia"
                        className="h-24 w-36 rounded-md border object-cover"
                      />
                    )}
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
                    disabled={isUploadingImage}
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
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
            {error.message || "No fue posible cargar las noticias."}
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
                      noticia.categoria,
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
                      className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(noticia.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && noticias.length === 0 && (
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
