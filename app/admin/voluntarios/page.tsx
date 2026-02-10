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
  fechaNacimiento: string;
  profesion: string;
  disponibilidad: string;
  estado: string;
  programa: number; // ID del programa
  programaNombre?: string; // Nombre del programa (opcional, desde el JOIN)
  fecha_creacion: string;
}

export default function VoluntariosAdmin() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    cedula: "",
    direccion: "",
    fechaNacimiento: "",
    profesion: "",
    disponibilidad: "",
    estado: "activo",
    programaId: "",
  });

  const profesiones = [
    "Estudiante",
    "Docente",
    "Psicólogo",
    "Trabajador Social",
    "Médico",
    "Enfermero",
  ];

  useEffect(() => {
    cargarVoluntarios();
    cargarProgramas();
  }, []);

  const cargarVoluntarios = async () => {
    try {
      const response = await fetch("/api/voluntarios");
      const data = await response.json();
      setVoluntarios(data);
    } catch (error) {
      console.log("[v0] Error loading volunteers:", error);
    }
  };

  const cargarProgramas = async () => {
    try {
      const response = await fetch("/api/programas");
      const data = await response.json();
      setProgramas(data);
    } catch (error) {
      console.log("[v0] Error loading programs:", error);
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
          `Voluntario ${editingId ? "actualizado" : "creado"} exitosamente.`
        );
        await cargarVoluntarios();
        setDialogOpen(false);
        setEditingId(null);
        resetForm();
      } else {
        // Solución Profesional: Manejar el error de la API y mostrarlo al usuario.
        const errorData = await response.json();
        toast.error(
          `Error: ${errorData.error || "No se pudo guardar el voluntario."}`
        );
      }
    } catch (error) {
      toast.error("Error de conexión. Por favor, intenta de nuevo.");
    }
  };

  const handleEdit = (voluntario: Voluntario) => {
    setEditingId(voluntario.id);
    setFormData({
      nombres: voluntario.nombre,
      apellidos: voluntario.apellido,
      email: voluntario.email,
      telefono: voluntario.telefono,
      cedula: voluntario.cedula,
      direccion: voluntario.direccion,
      // Solución Profesional: Formatear la fecha a YYYY-MM-DD para el input type="date"
      fechaNacimiento: voluntario.fechaNacimiento
        ? new Date(voluntario.fechaNacimiento).toISOString().split("T")[0]
        : "",
      profesion: voluntario.profesion,
      disponibilidad: voluntario.disponibilidad,
      estado: voluntario.estado,
      programaId: String(voluntario.programa || ""),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este voluntario?")) {
      try {
        await fetch(`/api/voluntarios/${id}`, { method: "DELETE" });
        await cargarVoluntarios();
      } catch (error) {
        console.log("[v0] Error deleting volunteer:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      email: "",
      telefono: "",
      cedula: "",
      direccion: "",
      fechaNacimiento: "",
      profesion: "",
      disponibilidad: "",
      estado: "activo",
      programaId: "",
    });
  };

  const voluntariosFiltrados = voluntarios.filter((voluntario) => {
    const matchFiltro =
      voluntario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      voluntario.email.toLowerCase().includes(filtro.toLowerCase()) ||
      voluntario.cedula.includes(filtro) ||
      (voluntario.apellido &&
        voluntario.apellido.toLowerCase().includes(filtro.toLowerCase()));

    const matchEstado =
      estadoFiltro === "todos" || voluntario.estado === estadoFiltro;

    return matchFiltro && matchEstado;
  });

  const voluntariosActivos = voluntarios.filter(
    (v) => v.estado === "activo"
  ).length;
  const voluntariosInactivos = voluntarios.filter(
    (v) => v.estado === "inactivo"
  ).length;

  const exportarCSV = () => {
    const headers = [
      "Nombre",
      "Email",
      "Teléfono",
      "Cédula",
      "Profesión",
      "Programa",
      "Estado",
      "Fecha Registro",
    ];
    const rows = voluntariosFiltrados.map((v: Voluntario) => [
      `${v.nombre} ${v.apellido}`,
      v.email,
      v.telefono,
      v.cedula,
      v.profesion,
      v.programaNombre || "N/A",
      v.estado,
      new Date(v.fecha_creacion).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voluntarios_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
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
          <div className="grid gap-6 md:grid-cols-3 mb-8">
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
              <div className="flex flex-col md:flex-row gap-4">
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
                  <Download className="h-4 w-4 mr-2" />
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nombres">Nombres *</Label>
                          <Input
                            id="nombres"
                            value={formData.nombres}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nombres: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="apellidos">Apellidos *</Label>
                          <Input
                            id="apellidos"
                            value={formData.apellidos}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                apellidos: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div>
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
                          />
                        </div>
                        <div>
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
                        <div>
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
                        <div>
                          <Label htmlFor="fecha_nacimiento">
                            Fecha de Nacimiento *
                          </Label>
                          <Input
                            id="fecha_nacimiento"
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
                        <div className="col-span-2">
                          <Label htmlFor="direccion">Dirección *</Label>
                          <Input
                            id="direccion"
                            value={formData.direccion}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                direccion: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
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
                        <div>
                          <Label htmlFor="programa">Programa Asignado</Label>
                          <Select
                            value={formData.programaId}
                            onValueChange={(value) =>
                              setFormData({ ...formData, programaId: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              {programas.map((programa: any) => (
                                <SelectItem
                                  key={programa.id}
                                  value={String(programa.id)}
                                >
                                  {programa.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
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
                      <div className="flex justify-end gap-2">
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
                    <TableHead>Nombre</TableHead>
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
                        {`${voluntario.nombre} ${voluntario.apellido}`}
                      </TableCell>
                      <TableCell>{voluntario.cedula}</TableCell>
                      <TableCell>{voluntario.email}</TableCell>
                      <TableCell>{voluntario.telefono}</TableCell>
                      <TableCell>{voluntario.profesion}</TableCell>
                      <TableCell className="text-sm">
                        {voluntario.disponibilidad}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {voluntario.programaNombre || "No asignado"}
                        </Badge>
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
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(voluntario.id)}
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
