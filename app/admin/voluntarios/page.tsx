"use client";

import { AuthGuard } from "@/components/auth-guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Loader2,
  FileSpreadsheet,
  Briefcase,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Voluntario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  cedula: string;
  direccion: string;
  fecha_nacimiento: string;
  profesion: string;
  disponibilidad: string;
  estado: string;
  programa: string;
  fecha_creacion: string;
}

export default function VoluntariosAdmin() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    cedula: "",
    direccion: "",
    fecha_nacimiento: "",
    profesion: "",
    disponibilidad: "",
    programa: "",
    estado: "activo",
  });

  const profesiones = [
    "Estudiante",
    "Docente",
    "Psicólogo",
    "Trabajador Social",
    "Médico",
    "Enfermero",
    "Pedagogica",
    "Eduacacion Fisica",
    "Nutricion",
  ];

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([cargarVoluntarios(), cargarProgramas()]);
      setIsLoading(false);
    };
    init();
  }, []);

  const cargarVoluntarios = async () => {
    try {
      const response = await fetch("/api/voluntarios");
      if (!response.ok) throw new Error("Error al cargar voluntarios");
      const data = await response.json();
      setVoluntarios(data);
    } catch (error) {
      console.error("Error loading volunteers:", error);
      toast.error("Error al cargar la lista de voluntarios");
    }
  };

  const cargarProgramas = async () => {
    try {
      const response = await fetch("/api/programas");
      if (!response.ok) throw new Error("Error al cargar programas");
      const data = await response.json();
      setProgramas(data);
    } catch (error) {
      console.error("Error loading programs:", error);
      toast.error("Error al cargar los programas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/voluntarios/${editingId}`
        : "/api/voluntarios";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          `El voluntario ${formData.nombre} ${formData.apellido} ha sido ${
            editingId ? "actualizado" : "creado"
          } exitosamente.`,
        );
        await cargarVoluntarios();
        setDialogOpen(false);
        setEditingId(null);
        resetForm();
      } else {
        // Solución Profesional: Manejar el error de la API y mostrarlo al usuario.
        const errorData = await response.json();
        toast.error(
          `Error: ${errorData.error || "No se pudo guardar el voluntario."}`,
        );
      }
    } catch (error) {
      toast.error("Error de conexión. Por favor, intenta de nuevo.");
    }
  };

  const handleEdit = (voluntario: Voluntario) => {
    setEditingId(voluntario.id);
    setFormData({
      nombre: voluntario.nombre,
      apellido: voluntario.apellido,
      email: voluntario.email,
      telefono: voluntario.telefono,
      cedula: voluntario.cedula,
      direccion: voluntario.direccion,
      // Solución Profesional: Formatear la fecha a YYYY-MM-DD para el input type="date"
      fecha_nacimiento: voluntario.fecha_nacimiento
        ? new Date(voluntario.fecha_nacimiento).toISOString().split("T")[0]
        : "",
      profesion: voluntario.profesion,
      disponibilidad: voluntario.disponibilidad,
      programa: voluntario.programa,
      estado: voluntario.estado,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar este voluntario? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        await fetch(`/api/voluntarios/${id}`, { method: "DELETE" });
        toast.success("Voluntario eliminado correctamente");
        await cargarVoluntarios();
      } catch (error) {
        toast.error("Error al eliminar el voluntario");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      cedula: "",
      direccion: "",
      fecha_nacimiento: "",
      profesion: "",
      disponibilidad: "",
      programa: "",
      estado: "activo",
    });
  };

  const voluntariosFiltrados = voluntarios.filter((voluntario) => {
    const matchFiltro =
      (voluntario.nombre?.toLowerCase() || "").includes(filtro.toLowerCase()) ||
      (voluntario.email?.toLowerCase() || "").includes(filtro.toLowerCase()) ||
      voluntario.cedula?.includes(filtro) ||
      false ||
      (voluntario.apellido?.toLowerCase() || "").includes(filtro.toLowerCase());

    const matchEstado =
      estadoFiltro === "todos" || voluntario.estado === estadoFiltro;

    return matchFiltro && matchEstado;
  });

  const voluntariosActivos = voluntarios.filter(
    (v) => v.estado === "activo",
  ).length;
  const voluntariosInactivos = voluntarios.filter(
    (v) => v.estado === "inactivo",
  ).length;

  const exportarCSV = () => {
    const headers = [
      "Nombres",
      "Apellidos",
      "Cédula",
      "Email",
      "Teléfono",
      "Dirección",
      "Fecha Nacimiento",
      "Profesión",
      "Disponibilidad",
      "Programa",
      "Estado",
      "Fecha Registro",
    ];

    // Función auxiliar para escapar campos que puedan contener comas o comillas
    const escapeCsvField = (field: any) => {
      if (field === null || field === undefined) return "";
      const stringField = String(field);
      if (
        stringField.includes(";") ||
        stringField.includes('"') ||
        stringField.includes("\n")
      ) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };

    const rows = voluntariosFiltrados.map((v) => [
      v.nombre,
      v.apellido,
      v.cedula,
      v.email,
      v.telefono,
      v.direccion,
      v.fecha_nacimiento
        ? new Date(v.fecha_nacimiento).toLocaleDateString()
        : "",
      v.profesion,
      v.disponibilidad,
      v.programa,
      v.estado,
      new Date(v.fecha_creacion).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row) => row.map(escapeCsvField).join(";")),
    ].join("\n");

    // Agregamos el BOM (\uFEFF) para que Excel reconozca correctamente los caracteres UTF-8 (tildes, ñ, etc.)
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voluntarios_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2e7d32]">
                Gestión de Voluntarios
              </h1>
              <p className="text-gray-600 mt-2">
                Datos personales y asignaciones de voluntarios
              </p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Voluntarios
                </CardTitle>
                <Users className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{voluntarios.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Registrados en el sistema
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Voluntarios Activos
                </CardTitle>
                <UserCheck className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{voluntariosActivos}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Actualmente participando
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Voluntarios Inactivos
                </CardTitle>
                <UserX className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{voluntariosInactivos}</div>
                <p className="text-xs text-gray-500 mt-1">
                  No están participando
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros y acciones */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por nombre, email o cédula..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activos</SelectItem>
                    <SelectItem value="inactivo">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportarCSV} variant="outline">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
                <Dialog
                  open={dialogOpen}
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                      setEditingId(null);
                      resetForm();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#2e7d32] hover:bg-[#1b5e20]">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Voluntario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingId
                          ? "Editar Voluntario"
                          : "Registrar Nuevo Voluntario"}
                      </DialogTitle>
                      <DialogDescription>
                        Ingresa los datos personales del voluntario
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div className="col-span-1 md:col-span-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 border-b pb-1">
                            Información Personal
                          </h4>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombres *</Label>
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nombre: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellidos *</Label>
                          <Input
                            id="apellido"
                            value={formData.apellido}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                apellido: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cedula">Cédula *</Label>
                          <Input
                            id="cedula"
                            value={formData.cedula}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cedula: e.target.value,
                              })
                            }
                            required
                            disabled={!!editingId}
                          />
                        </div>

                        <div className="col-span-1 md:col-span-2 mt-2">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 border-b pb-1">
                            Contacto y Dirección
                          </h4>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono *</Label>
                          <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                telefono: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fecha_nacimiento">
                            Fecha de Nacimiento *
                          </Label>
                          <Input
                            id="fecha_nacimiento"
                            type="date"
                            value={formData.fecha_nacimiento}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fecha_nacimiento: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="profesion">Profesión</Label>
                          <Select
                            value={formData.profesion}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                profesion: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar profesión..." />
                            </SelectTrigger>
                            <SelectContent>
                              {profesiones.map((profesion) => (
                                <SelectItem key={profesion} value={profesion}>
                                  {profesion}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="disponibilidad">Disponibilidad</Label>
                          <Select
                            value={formData.disponibilidad}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                disponibilidad: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Entre semana">
                                Entre semana
                              </SelectItem>
                              <SelectItem value="Flexible">Flexible</SelectItem>
                              <SelectItem value="Solo mañanas">
                                Solo mañanas
                              </SelectItem>
                              <SelectItem value="Solo tardes">
                                Solo tardes
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="programa">Programa Asignado</Label>
                          <Select
                            value={formData.programa}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                programa: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {programas.map((programa: any) => (
                                <SelectItem
                                  key={programa.id}
                                  value={programa.nombre}
                                >
                                  {programa.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado</Label>
                          <Select
                            value={formData.estado}
                            onValueChange={(value) =>
                              setFormData({ ...formData, estado: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="activo">Activo</SelectItem>
                              <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setDialogOpen(false);
                            setEditingId(null);
                            resetForm();
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#2e7d32] hover:bg-[#1b5e20]"
                        >
                          {editingId ? "Actualizar" : "Guardar"} Voluntario
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de voluntarios */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Voluntarios</CardTitle>
              <CardDescription>
                Mostrando {voluntariosFiltrados.length} de {voluntarios.length}{" "}
                voluntarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombres</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Profesión</TableHead>
                    <TableHead>Disponibilidad</TableHead>
                    <TableHead>Programa</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voluntariosFiltrados.map((voluntario) => (
                    <TableRow key={voluntario.id}>
                      <TableCell className="font-medium">
                        {voluntario.nombre}
                      </TableCell>
                      <TableCell>{voluntario.apellido}</TableCell>
                      <TableCell>{voluntario.cedula}</TableCell>
                      <TableCell>{voluntario.email}</TableCell>
                      <TableCell>{voluntario.telefono}</TableCell>
                      <TableCell>{voluntario.profesion}</TableCell>
                      <TableCell className="text-sm">
                        {voluntario.disponibilidad}
                      </TableCell>
                      <TableCell className="text-sm">
                        {voluntario.programa}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            voluntario.estado === "activo"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {voluntario.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(voluntario)}
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(voluntario.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
