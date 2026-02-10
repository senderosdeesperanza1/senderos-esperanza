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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Programa {
  id: string;
  nombre: string;
  descripcion: string;
  objetivos: string;
  beneficiarios: number;
  presupuesto: number;
  activo: boolean;
  fechaInicio: string;
  responsable: string;
}

export default function ProgramasAdmin() {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    objetivos: "",
    beneficiarios: "",
    presupuesto: "",
    activo: true,
    responsable: "",
  });

  useEffect(() => {
    cargarProgramas();
  }, []);

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
      const url = editingId ? `/api/programas/${editingId}` : "/api/programas";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          beneficiarios: parseInt(formData.beneficiarios),
          presupuesto: parseFloat(formData.presupuesto),
        }),
      });

      if (response.ok) {
        await cargarProgramas();
        setDialogOpen(false);
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.log("[v0] Error saving program:", error);
    }
  };

  const handleEdit = (programa: Programa) => {
    setEditingId(programa.id);
    setFormData({
      nombre: programa.nombre,
      descripcion: programa.descripcion,
      objetivos: programa.objetivos,
      beneficiarios: programa.beneficiarios.toString(),
      presupuesto: programa.presupuesto.toString(),
      activo: programa.activo,
      responsable: programa.responsable,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este programa?")) {
      try {
        await fetch(`/api/programas/${id}`, { method: "DELETE" });
        await cargarProgramas();
      } catch (error) {
        console.log("[v0] Error deleting program:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      objetivos: "",
      beneficiarios: "",
      presupuesto: "",
      activo: true,
      responsable: "",
    });
  };

  const programasActivos = programas.filter((p) => p.activo).length;
  const totalBeneficiarios = programas.reduce(
    (sum, p) => sum + p.beneficiarios,
    0
  );
  const presupuestoTotal = programas.reduce((sum, p) => sum + p.presupuesto, 0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2e7d32]">
                Gestión de Programas
              </h1>
              <p className="text-gray-600 mt-2">
                Agregar, editar y eliminar proyectos sociales
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
                  Programas Activos
                </CardTitle>
                <Activity className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{programasActivos}</div>
                <p className="text-xs text-gray-500 mt-1">
                  De {programas.length} programas totales
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Beneficiarios
                </CardTitle>
                <Users className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBeneficiarios}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Personas impactadas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Presupuesto Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${presupuestoTotal.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inversión en programas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Botón para agregar */}
          <div className="mb-6 flex justify-end">
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
                  Crear Nuevo Programa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Editar Programa" : "Crear Nuevo Programa"}
                  </DialogTitle>
                  <DialogDescription>
                    Ingresa la información del programa social o educativo
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre del Programa *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      placeholder="Ej: Educación y Capacitación"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion: e.target.value,
                        })
                      }
                      placeholder="Describe brevemente el programa..."
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="objetivos">Objetivos *</Label>
                    <Textarea
                      id="objetivos"
                      value={formData.objetivos}
                      onChange={(e) =>
                        setFormData({ ...formData, objetivos: e.target.value })
                      }
                      placeholder="¿Qué se espera lograr con este programa?"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="beneficiarios">
                        Número de Beneficiarios *
                      </Label>
                      <Input
                        id="beneficiarios"
                        type="number"
                        value={formData.beneficiarios}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            beneficiarios: e.target.value,
                          })
                        }
                        placeholder="150"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="presupuesto">Presupuesto (COP) *</Label>
                      <Input
                        id="presupuesto"
                        type="number"
                        value={formData.presupuesto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            presupuesto: e.target.value,
                          })
                        }
                        placeholder="5000000"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="responsable">
                      Responsable del Programa
                    </Label>
                    <Input
                      id="responsable"
                      value={formData.responsable}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          responsable: e.target.value,
                        })
                      }
                      placeholder="Nombre del coordinador"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="activo"
                      checked={formData.activo}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, activo: checked })
                      }
                    />
                    <Label htmlFor="activo">Programa activo</Label>
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
                      {editingId ? "Actualizar" : "Crear"} Programa
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Lista de programas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programas.map((programa) => (
              <Card
                key={programa.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {programa.nombre}
                      </CardTitle>
                      <Badge
                        variant={programa.activo ? "default" : "secondary"}
                        className="mt-2"
                      >
                        {programa.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {programa.descripcion}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-[#2e7d32]" />
                      <span className="font-medium">Objetivos:</span>
                    </div>
                    <p className="text-sm text-gray-600 pl-6">
                      {programa.objetivos}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <Users className="h-3 w-3" />
                        Beneficiarios
                      </div>
                      <p className="font-semibold">{programa.beneficiarios}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                        <DollarSign className="h-3 w-3" />
                        Presupuesto
                      </div>
                      <p className="font-semibold">
                        ${programa.presupuesto.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {programa.responsable && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500">Responsable:</p>
                      <p className="text-sm font-medium">
                        {programa.responsable}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(programa)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(programa.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {programas.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay programas registrados</p>
                <p className="text-sm text-gray-400 mt-1">
                  Crea tu primer programa haciendo clic en el botón de arriba
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
