"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit, Plus, Trash2, Upload } from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { AuthGuard } from "@/components/auth-guard";
import { auth } from "@/lib/firebase";

interface GaleriaItem {
  id?: string;
  imagen: string;
  fecha?: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      [data?.error, data?.details].filter(Boolean).join(": ") ||
        "No fue posible cargar la galería",
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("La respuesta de la galería no tiene un formato válido");
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

function AdminGaleriaContent() {
  const { data: galeria = [], error, isLoading } = useSWR("/api/galeria", fetcher);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GaleriaItem | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    fecha: getLocalDate(),
    imagen: "",
  });

  const resetForm = () => {
    setFormData({
      fecha: getLocalDate(),
      imagen: "",
    });
    setEditingItem(null);
    setIsFormOpen(false);
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
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("No fue posible procesar la imagen."));
          },
          "image/jpeg",
          0.8,
        );
      });

      if (compressedImage.size > 700 * 1024) {
        throw new Error("La imagen comprimida sigue siendo grande. Prueba con otra imagen.");
      }

      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("No fue posible preparar la imagen."));
        reader.readAsDataURL(compressedImage);
      });

      setFormData((current) => ({ ...current, imagen: imageUrl }));
      toast.success("Imagen lista para guardar.");
    } catch (error) {
      console.error("Error uploading gallery image:", error);
      toast.error(
        error instanceof Error ? error.message : "No fue posible subir la imagen.",
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const getAuthHeaders = async () => {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imagen.trim()) {
      toast.error("Debes poner la URL de la imagen");
      return;
    }

    try {
      const payload = {
        ...formData,
      };
      const authHeaders = await getAuthHeaders();

      const response = editingItem?.id
        ? await fetch(`/api/galeria/${editingItem.id}`, {
            method: "PUT",
            headers: authHeaders,
            body: JSON.stringify(payload),
          })
        : await fetch("/api/galeria", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify(payload),
          });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          [data?.error, data?.details].filter(Boolean).join(": ") ||
            "No fue posible guardar la imagen",
        );
      }

      mutate("/api/galeria");
      resetForm();
      toast.success(
        editingItem ? "Imagen actualizada correctamente" : "Imagen creada correctamente",
      );
    } catch (error) {
      console.error("Error saving gallery item:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar la imagen",
      );
    }
  };

  const handleEdit = (item: GaleriaItem) => {
    setEditingItem(item);
    setFormData({
      fecha: item.fecha ? item.fecha.slice(0, 10) : getLocalDate(),
      imagen: item.imagen || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/api/galeria/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "No fue posible eliminar la imagen");
      }

      mutate("/api/galeria");
      toast.success("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar la imagen",
      );
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return "";
    const date = parseCalendarDate(value);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" aria-label="Volver al inicio">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#2e7d32]">Administrar Galería</h1>
            </div>
          </div>

          <Button
            onClick={() => {
              setIsFormOpen(true);
              setEditingItem(null);
              setFormData({
                  fecha: getLocalDate(),
                  imagen: "",
                });
            }}
            className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva imagen
          </Button>
        </div>

        {isFormOpen && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingItem ? "Editar imagen" : "Agregar nueva imagen"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagen">URL o imagen desde equipo</Label>
                    <Input
                      id="imagen"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      placeholder="https://.../imagen.jpg"
                    />

                    <Label
                      htmlFor="archivo-imagen"
                      className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#2e7d32] hover:underline"
                    >
                      <Upload className="h-4 w-4" />
                      {isUploadingImage ? "Preparando imagen..." : "Subir imagen desde el equipo"}
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
                        alt="Vista previa"
                        className="h-28 w-full rounded-md border object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
                    disabled={isUploadingImage}
                  >
                    {editingItem ? "Actualizar" : "Guardar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#2e7d32]" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
            {error.message || "No fue posible cargar la galería."}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galeria.map((item: GaleriaItem) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-56">
                  <img
                    src={item.imagen || "/placeholder.svg"}
                    alt="Imagen de galería"
                    className="h-full w-full object-cover"
                  />
                </div>

                <CardContent className="space-y-3 pt-4">
                  <p className="text-sm text-muted-foreground">{formatDate(item.fecha)}</p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                      className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && galeria.length === 0 && (
          <div className="py-12 text-center">
            <p className="mb-4 text-muted-foreground">Aún no hay imágenes en la galería.</p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-[#2e7d32] hover:bg-[#2e7d32]/90">
              <Plus className="mr-2 h-4 w-4" />
              Crear primera imagen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminGaleriaPage() {
  return (
    <AuthGuard>
      <AdminGaleriaContent />
    </AuthGuard>
  );
}
