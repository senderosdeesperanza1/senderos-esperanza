'use client'

import { AuthGuard } from '@/components/auth-guard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DollarSign, Download, Filter, Plus, Search, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Donacion {
  id: string
  nombre: string
  email: string
  telefono: string
  monto: number
  metodo: string
  estado: string
  fecha: string
  referencia: string
}

export default function DonacionesAdmin() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([])
  const [filtro, setFiltro] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState('todos')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    monto: '',
    metodo: 'PSE',
    estado: 'completada',
    referencia: '',
  })

  useEffect(() => {
    cargarDonaciones()
  }, [])

  const cargarDonaciones = async () => {
    try {
      const response = await fetch('/api/donaciones')
      const data = await response.json()
      setDonaciones(data)
    } catch (error) {
      console.log('[v0] Error loading donations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/donaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monto: parseFloat(formData.monto),
        }),
      })

      if (response.ok) {
        await cargarDonaciones()
        setDialogOpen(false)
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          monto: '',
          metodo: 'PSE',
          estado: 'completada',
          referencia: '',
        })
      }
    } catch (error) {
      console.log('[v0] Error creating donation:', error)
    }
  }

  const donacionesFiltradas = donaciones.filter((donacion) => {
    const matchFiltro = 
      (donacion.nombre?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
      (donacion.email?.toLowerCase() || '').includes(filtro.toLowerCase()) ||
      (donacion.referencia?.toLowerCase() || '').includes(filtro.toLowerCase())
    
    const matchEstado = estadoFiltro === 'todos' || donacion.estado === estadoFiltro
    
    return matchFiltro && matchEstado
  })

  const totalDonaciones = donaciones.reduce((sum, d) => sum + d.monto, 0)
  const totalMes = donaciones
    .filter((d) => {
      const donationDate = new Date(d.fecha)
      const now = new Date()
      return donationDate.getMonth() === now.getMonth() && 
             donationDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, d) => sum + d.monto, 0)

  const exportarCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Monto', 'Método', 'Estado', 'Referencia']
    const rows = donacionesFiltradas.map((d) => [
      new Date(d.fecha).toLocaleDateString(),
      d.nombre,
      d.email,
      d.telefono,
      d.monto,
      d.metodo,
      d.estado,
      d.referencia,
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donaciones_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2e7d32]">Gestión de Donaciones</h1>
              <p className="text-gray-600 mt-2">Registro, seguimiento y reportes de donaciones</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">Volver al Dashboard</Button>
            </Link>
          </div>

          {/* Estadísticas */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
                <DollarSign className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDonaciones.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Todas las donaciones</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalMes.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Donaciones del mes actual</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
                <Filter className="h-4 w-4 text-[#2e7d32]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donaciones.length}</div>
                <p className="text-xs text-gray-500 mt-1">Registros totales</p>
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
                      placeholder="Buscar por nombre, email o referencia..."
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
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="fallida">Fallida</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportarCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#2e7d32] hover:bg-[#1b5e20]">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Donación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Registrar Nueva Donación</DialogTitle>
                      <DialogDescription>
                        Ingresa los datos de la donación manual
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nombre">Nombre Completo</Label>
                          <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="monto">Monto (COP)</Label>
                          <Input
                            id="monto"
                            type="number"
                            value={formData.monto}
                            onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="metodo">Método de Pago</Label>
                          <Select
                            value={formData.metodo}
                            onValueChange={(value) => setFormData({ ...formData, metodo: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PSE">PSE</SelectItem>
                              <SelectItem value="Nequi">Nequi</SelectItem>
                              <SelectItem value="Daviplata">Daviplata</SelectItem>
                              <SelectItem value="Efectivo">Efectivo</SelectItem>
                              <SelectItem value="Transferencia">Transferencia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="estado">Estado</Label>
                          <Select
                            value={formData.estado}
                            onValueChange={(value) => setFormData({ ...formData, estado: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completada">Completada</SelectItem>
                              <SelectItem value="pendiente">Pendiente</SelectItem>
                              <SelectItem value="fallida">Fallida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="referencia">Referencia</Label>
                          <Input
                            id="referencia"
                            value={formData.referencia}
                            onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                            placeholder="Número de referencia de la transacción"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-[#2e7d32] hover:bg-[#1b5e20]">
                          Guardar Donación
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de donaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Donaciones</CardTitle>
              <CardDescription>
                Mostrando {donacionesFiltradas.length} de {donaciones.length} donaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Donante</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Referencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donacionesFiltradas.map((donacion) => (
                    <TableRow key={donacion.id}>
                      <TableCell>
                        {new Date(donacion.fecha).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-medium">{donacion.nombre}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{donacion.email}</div>
                          <div className="text-gray-500">{donacion.telefono}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${donacion.monto.toLocaleString()}
                      </TableCell>
                      <TableCell>{donacion.metodo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            donacion.estado === 'completada'
                              ? 'default'
                              : donacion.estado === 'pendiente'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {donacion.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {donacion.referencia}
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
  )
}
