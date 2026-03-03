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
import {
  Users,
  Shield,
  User,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  fechaCreacion: string;
  ultimoAcceso: string;
}

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "coordinador",
    estado: "activo",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.log("[v0] Error loading users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingId ? `/api/usuarios/${editingId}` : "/api/usuarios";
      const method = editingId ? "PUT" : "POST";

      // --- Ajuste importante ---
      const body: any = { ...formData };

      // Si estamos editando y password está vacío, elimínalo del body
      if (
        editingId &&
        (!formData.password || formData.password.trim() === "")
      ) {
        delete body.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await cargarUsuarios();
        setDialogOpen(false);
        setEditingId(null);
        resetForm();
      } else {
        const errorData = await response.json();
        // Muestra una alerta específica si el correo ya existe
        if (
          errorData.error &&
          errorData.error.includes("El correo ya está registrado")
        ) {
          alert(
            "Error: El correo electrónico ya está registrado. Por favor, utiliza otro.",
          );
        } else {
          alert("Ocurrió un error al guardar el usuario.");
        }
        console.error("Error al guardar:", errorData);
      }
    } catch (error) {
      console.log("[v0] Error saving user:", error);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      estado: usuario.estado,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.",
      )
    ) {
      try {
        await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
        await cargarUsuarios();
      } catch (error) {
        console.log("[v0] Error deleting user:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      password: "",
      rol: "coordinador",
      estado: "activo",
    });
    setShowPassword(false);
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchFiltro =
      usuario.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email.toLowerCase().includes(filtro.toLowerCase());

    const matchRol = rolFiltro === "todos" || usuario.rol === rolFiltro;

    return matchFiltro && matchRol;
  });

  const totalAdmins = usuarios.filter((u) => u.rol === "admin").length;
  const totalCoordinadores = usuarios.filter(
    (u) => u.rol === "coordinador",
  ).length;
  const usuariosActivos = usuarios.filter((u) => u.estado === "activo").length;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2e7d32]">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600 mt-2">
                Administración del personal y miembros del sistema
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
                  Total Usuarios
                </CardTitle>
                <Users className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usuarios.length}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {usuariosActivos} activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Administradores
                </CardTitle>
                <Shield className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAdmins}</div>
                <p className="text-xs text-gray-500 mt-1">Acceso completo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Coordinadores
                </CardTitle>
                <User className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCoordinadores}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Gestión de programas
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
                      placeholder="Buscar por nombre o email..."
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={rolFiltro} onValueChange={setRolFiltro}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los roles</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="coordinador">Coordinador</SelectItem>
                  </SelectContent>
                </Select>
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
                      Crear Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingId ? "Editar Usuario" : "Crear Nuevo Usuario"}
                      </DialogTitle>
                      <DialogDescription>
                        Configura los permisos y datos de acceso del usuario
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="nombre">Nombre Completo *</Label>
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nombre: e.target.value,
                              })
                            }
                            placeholder="Juan Pérez"
                            required
                          />
                        </div>
                        <div className="col-span-2">
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
                            placeholder="usuario@example.com"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="password">
                            {editingId
                              ? "Nueva Contraseña (dejar vacío para mantener)"
                              : "Contraseña *"}
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  password: e.target.value,
                                })
                              }
                              placeholder="••••••••"
                              required={!editingId}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="rol">Rol *</Label>
                          <Select
                            value={formData.rol}
                            onValueChange={(value) =>
                              setFormData({ ...formData, rol: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                Administrador
                              </SelectItem>
                              <SelectItem value="coordinador">
                                Coordinador
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.rol === "admin" &&
                              "Acceso completo al sistema"}
                            {formData.rol === "coordinador" &&
                              "Gestiona programas y voluntarios"}
                            {formData.rol === "operador" &&
                              "Solo consulta información"}
                          </p>
                        </div>
                        <div>
                          <Label htmlFor="estado">Estado *</Label>
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
                      <div className="flex justify-end gap-2 pt-4">
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
                          {editingId ? "Actualizar" : "Crear"} Usuario
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de usuarios */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>
                Mostrando {usuariosFiltrados.length} de {usuarios.length}{" "}
                usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            usuario.rol === "admin"
                              ? "default"
                              : usuario.rol === "coordinador"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {usuario.rol === "admin" && (
                            <Shield className="h-3 w-3 mr-1" />
                          )}
                          {usuario.rol}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            usuario.estado === "activo"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {usuario.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {usuario.ultimoAcceso || "Nunca"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(usuario)}
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(usuario.id)}
                            disabled={
                              usuario.rol === "admin" && totalAdmins === 1
                            }
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
