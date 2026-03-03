"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Search,
  FileText,
  Trash2,
  Eye,
  Upload,
  Download,
  FolderOpen,
  Grid3x3,
  List,
  Filter,
  MoreVertical,
  File,
  ImageIcon,
  FileVideo,
  FileArchive,
  Folder,
  Loader2,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BeneficiariosAdmin() {
  const {
    data: beneficiarios,
    error,
    mutate,
  } = useSWR("/api/beneficiarios", fetcher);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddingBeneficiario, setIsAddingBeneficiario] = useState(false);
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<any>(null);
  const [isViewingExpediente, setIsViewingExpediente] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    cedula: "",
    genero: "",
    direccion: "",
    barrio: "",
    nombreAcudiente: "",
    telefonoAcudiente: "",
    emailAcudiente: "",
    programasInscritos: [] as string[],
  });

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const edad = formData.fechaNacimiento
      ? calcularEdad(formData.fechaNacimiento)
      : 0;

    const beneficiarioData = {
      ...formData,
      edad,
    };

    try {
      const response = await fetch("/api/beneficiarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(beneficiarioData),
      });

      if (response.ok) {
        mutate();
        setFormData({
          nombres: "",
          apellidos: "",
          fechaNacimiento: "",
          cedula: "",
          genero: "",
          direccion: "",
          barrio: "",
          nombreAcudiente: "",
          telefonoAcudiente: "",
          emailAcudiente: "",
          programasInscritos: [],
        });
        setIsAddingBeneficiario(false);
      }
    } catch (error) {
      console.error("Error al crear beneficiario:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este beneficiario?")) return;

    try {
      const response = await fetch(`/api/beneficiarios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Error al eliminar beneficiario:", error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que haya un beneficiario seleccionado
    if (!selectedBeneficiario || !selectedBeneficiario.id) {
      alert("No hay beneficiario seleccionado");
      return;
    }

    setUploadingFile(true);

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64 = reader.result as string;

          // Validar que se haya leído el archivo
          if (!base64) {
            throw new Error("No se pudo leer el archivo");
          }

          // Determinar tipo de archivo
          let tipo = "pdf";
          if (file.type.includes("image")) tipo = "image";
          else if (file.type.includes("video")) tipo = "video";
          else if (file.type.includes("zip") || file.type.includes("rar"))
            tipo = "zip";

          // Enviamos el contenido del archivo, su tipo y su tamaño.
          const archivoData = {
            nombre: file.name, // Añadimos el nombre del archivo
            archivo: base64,
            tipo: tipo,
            size: file.size, // Añadimos el tamaño del archivo aquí
          };

          console.log("Enviando datos:", {
            beneficiarioId: selectedBeneficiario.id,
            nombre: archivoData.nombre,
            tipo: archivoData.tipo,
            size: archivoData.size,
            archivoLength: base64.length,
          });

          // Subir a la API
          const response = await fetch(
            `/api/beneficiarios/${selectedBeneficiario.id}/archivos`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(archivoData),
            },
          );

          const responseData = await response.json();

          if (response.ok) {
            console.log("Archivo subido exitosamente");

            // Recargar datos
            await mutate();

            // Actualizar beneficiario seleccionado
            const updatedBeneficiarios = await fetch("/api/beneficiarios").then(
              (r) => r.json(),
            );
            const updatedBeneficiario = updatedBeneficiarios.find(
              (b: any) => b.id === selectedBeneficiario.id,
            );
            setSelectedBeneficiario(updatedBeneficiario);

            setUploadingFile(false);

            // Limpiar input
            e.target.value = "";

            alert("Archivo subido correctamente");
          } else {
            console.error("Error del servidor:", responseData);
            alert(
              `Error al subir archivo: ${
                responseData.error || "Error desconocido"
              }`,
            );
            setUploadingFile(false);
          }
        } catch (innerError) {
          console.error("Error en el procesamiento:", innerError);
          alert("Error al procesar el archivo");
          setUploadingFile(false);
        }
      };

      reader.onerror = () => {
        console.error("Error al leer el archivo");
        alert("Error al leer el archivo");
        setUploadingFile(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error general:", error);
      alert("Error al subir el archivo");
      setUploadingFile(false);
    }
  };

  const handleDeleteArchivo = async (archivoId: string) => {
    if (!confirm("¿Estás seguro de eliminar este archivo?")) return;

    try {
      const response = await fetch(
        `/api/beneficiarios/${selectedBeneficiario.id}/archivos`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ archivoId }),
        },
      );

      if (response.ok) {
        await mutate();
        const updatedBeneficiarios = await fetch("/api/beneficiarios").then(
          (r) => r.json(),
        );
        const updatedBeneficiario = updatedBeneficiarios.find(
          (b: any) => b.id === selectedBeneficiario.id,
        );
        setSelectedBeneficiario(updatedBeneficiario);
      }
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
    }
  };

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case "image":
      case "jpg":
      case "png":
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case "video":
        return <FileVideo className="w-8 h-8 text-purple-500" />;
      case "zip":
        return <FileArchive className="w-8 h-8 text-amber-500" />;
      default:
        return <FileText className="w-8 h-8 text-red-500" />;
    }
  };

  // Función auxiliar para determinar si un archivo se puede ver online
  const canBeViewedOnline = (tipo: string) => {
    const viewableTypes = ["pdf", "image", "jpg", "png", "jpeg", "gif", "webp"];
    return viewableTypes.includes(tipo);
  };

  // 1. Manejo de estado de carga y error de forma robusta
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error al cargar los beneficiarios. Por favor, intenta de nuevo más
        tarde.
      </div>
    );
  }

  if (!beneficiarios) {
    return <div className="p-8 text-center">Cargando beneficiarios...</div>;
  }

  // 2. Filtrado seguro, solo se ejecuta si 'beneficiarios' es un array
  const filteredBeneficiarios = Array.isArray(beneficiarios)
    ? beneficiarios.filter((b: any) =>
        `${b.nombres || ""} ${b.apellidos || ""} ${b.nombreAcudiente || ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Beneficiarios
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Expedientes digitales de niños y jóvenes
              </p>
            </div>
            <Button
              onClick={() => setIsAddingBeneficiario(true)}
              className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Beneficiario
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar beneficiarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 bg-gray-50 border-gray-200"
              />
            </div>
            <div className="flex items-center gap-2 border-l pl-3">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold text-[#2e7d32]">
              {filteredBeneficiarios.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Activos:</span>
            <span className="font-semibold text-[#2e7d32]">
              {
                filteredBeneficiarios.filter((b: any) => b.estado === "activo")
                  .length
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Expedientes:</span>
            <span className="font-semibold text-[#f4c542]">
              {filteredBeneficiarios.length}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBeneficiarios.map((beneficiario: any) => (
              <Card
                key={beneficiario.id}
                className="group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-[#2e7d32]"
                onClick={() => {
                  setSelectedBeneficiario(beneficiario);
                  setIsViewingExpediente(true);
                }}
              >
                <CardContent className="p-0">
                  <div className="h-32 bg-linear-to-br from-[#2e7d32] to-[#1b5e20] flex items-center justify-center relative">
                    <Folder className="w-16 h-16 text-white opacity-80" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(beneficiario.id);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-sm truncate text-gray-900 mb-1">
                      {beneficiario.nombres} {beneficiario.apellidos}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="text-xs bg-[#2e7d32] hover:bg-[#2e7d32]">
                        {beneficiario.edad} años
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">
                      {beneficiario.nombreAcudiente}
                    </p>
                    {beneficiario.archivos &&
                      beneficiario.archivos.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <FileText className="w-3 h-3" />
                          <span>{beneficiario.archivos.length} archivo(s)</span>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            {filteredBeneficiarios.map((beneficiario: any, index: number) => (
              <div
                key={beneficiario.id}
                className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                  index !== 0 ? "border-t" : ""
                }`}
                onClick={() => {
                  setSelectedBeneficiario(beneficiario);
                  setIsViewingExpediente(true);
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded bg-[#2e7d32] flex items-center justify-center">
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      {beneficiario.nombres} {beneficiario.apellidos}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      Acudiente: {beneficiario.nombreAcudiente} ·{" "}
                      {beneficiario.edad} años
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Badge className="bg-[#2e7d32] hover:bg-[#2e7d32]">
                      {beneficiario.genero}
                    </Badge>
                    {beneficiario.archivos &&
                      beneficiario.archivos.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {beneficiario.archivos.length} archivo(s)
                        </span>
                      )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(beneficiario.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={isAddingBeneficiario}
        onOpenChange={setIsAddingBeneficiario}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Beneficiario</DialogTitle>
            <DialogDescription>
              Completa la información del niño o joven
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaNacimiento: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Género *</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) =>
                    setFormData({ ...formData, genero: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula o Documento</Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) =>
                  setFormData({ ...formData, cedula: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barrio">Barrio</Label>
                <Input
                  id="barrio"
                  value={formData.barrio}
                  onChange={(e) =>
                    setFormData({ ...formData, barrio: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Información del Acudiente</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreAcudiente">
                    Nombre del Acudiente *
                  </Label>
                  <Input
                    id="nombreAcudiente"
                    value={formData.nombreAcudiente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombreAcudiente: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefonoAcudiente">Teléfono *</Label>
                    <Input
                      id="telefonoAcudiente"
                      value={formData.telefonoAcudiente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          telefonoAcudiente: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAcudiente">Email</Label>
                    <Input
                      id="emailAcudiente"
                      type="email"
                      value={formData.emailAcudiente}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailAcudiente: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddingBeneficiario(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
              >
                Registrar Beneficiario
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewingExpediente} onOpenChange={setIsViewingExpediente}>
        <DialogContent className="w-full h-[95vh] max-w-none overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  {selectedBeneficiario?.nombres}{" "}
                  {selectedBeneficiario?.apellidos}
                </DialogTitle>
                <DialogDescription>Expediente Digital</DialogDescription>
              </div>
              <Badge className="bg-[#2e7d32] hover:bg-[#2e7d32]">
                {selectedBeneficiario?.edad} años
              </Badge>
            </div>
          </DialogHeader>

          {selectedBeneficiario && (
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Género</p>
                  <p className="font-semibold text-sm">
                    {selectedBeneficiario.genero}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Acudiente</p>
                  <p className="font-semibold text-sm">
                    {selectedBeneficiario.nombreAcudiente}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Teléfono</p>
                  <p className="font-semibold text-sm">
                    {selectedBeneficiario.telefonoAcudiente}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Dirección</p>
                  <p className="font-semibold text-sm">
                    {selectedBeneficiario.direccion}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2e7d32]" />
                  Subir Archivo
                </h3>

                <div className="flex items-center justify-between">
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.zip,.rar"
                    disabled={uploadingFile}
                  />

                  <Button
                    className="bg-[#2e7d32] hover:bg-[#2e7d32]/90"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Seleccionar archivo
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-[#2e7d32]" />
                    Archivos del Expediente
                  </h3>
                  <span className="text-sm text-gray-600">
                    {selectedBeneficiario.archivos?.length || 0} elemento(s)
                  </span>
                </div>

                {selectedBeneficiario.archivos &&
                selectedBeneficiario.archivos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedBeneficiario.archivos.map((archivo: any) => (
                      <a
                        key={archivo.id}
                        href={archivo.ruta || "#"}
                        target="_blank"
                        // Solución Profesional: El atributo 'download' solo se aplica
                        // si el archivo NO se puede ver online. Si es un PDF o imagen,
                        // este atributo será 'undefined' y el navegador lo abrirá.
                        download={
                          !canBeViewedOnline(archivo.tipo)
                            ? archivo.nombre
                            : undefined
                        }
                        rel="noopener noreferrer" // Buena práctica de seguridad para target="_blank"
                        className="no-underline"
                      >
                        <Card className="group hover:shadow-md transition-all cursor-pointer border-2 hover:border-[#2e7d32]">
                          <CardContent className="p-0">
                            <div className="h-24 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                              {getFileIcon(archivo.tipo)}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteArchivo(archivo.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="p-3">
                              <h4 className="font-medium text-xs truncate text-gray-900 mb-1">
                                {archivo.nombre}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-[10px] mb-1"
                              >
                                {archivo.tipo}
                              </Badge>
                              <p className="text-[10px] text-gray-500">
                                {new Date(archivo.fecha).toLocaleDateString()}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
                    <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm font-medium">
                      Esta carpeta está vacía
                    </p>
                    <p className="text-xs mt-1">
                      Agrega archivos al expediente del beneficiario
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
