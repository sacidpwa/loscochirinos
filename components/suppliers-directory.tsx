"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Pencil,
  Trash2,
  Phone,
  Mail,
  MapPin,
  User,
  Package,
  Calendar,
  CreditCard,
  Star,
  ArrowLeft,
  Search,
} from "lucide-react"

interface Supplier {
  id: number
  name: string
  phone: string
  email: string
  address: string
  contact_person: string
  supplies: string
  delivery_days: string
  payment_method: string
  rating: number
  notes: string
}

export function SuppliersDirectory() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    contact_person: "",
    supplies: "",
    delivery_days: "",
    payment_method: "",
    rating: 5,
    notes: "",
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers")
      const data = await res.json()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      contact_person: "",
      supplies: "",
      delivery_days: "",
      payment_method: "",
      rating: 5,
      notes: "",
    })
    setEditingSupplier(null)
  }

  const openEditDialog = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      contact_person: supplier.contact_person,
      supplies: supplier.supplies,
      delivery_days: supplier.delivery_days,
      payment_method: supplier.payment_method,
      rating: supplier.rating,
      notes: supplier.notes,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) return

    try {
      if (editingSupplier) {
        await fetch("/api/suppliers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSupplier.id, ...formData }),
        })
      } else {
        await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
      }
      await loadSuppliers()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving supplier:", error)
    }
  }

  const deleteSupplier = async (id: number) => {
    if (!confirm("¿Eliminar este proveedor?")) return
    try {
      await fetch("/api/suppliers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await loadSuppliers()
    } catch (error) {
      console.error("Error deleting supplier:", error)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.supplies.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Inicio
            </Button>
          </Link>
          <Image src="/logo.png" alt="Los Cochirinos" width={120} height={32} className="h-8 w-auto" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Agregar Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Nombre del Proveedor *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Carnicería El Buen Corte"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="999-123-4567"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Dirección</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle, número, colonia"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Persona de Contacto</label>
                <Input
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Nombre de quien te atiende"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Insumos que Provee</label>
                <Textarea
                  value={formData.supplies}
                  onChange={(e) => setFormData({ ...formData, supplies: e.target.value })}
                  placeholder="Ej: Carne de cerdo, pierna, costilla..."
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Días de Entrega</label>
                  <Input
                    value={formData.delivery_days}
                    onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                    placeholder="Ej: Lunes, Miércoles, Viernes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Forma de Pago</label>
                  <Input
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    placeholder="Ej: Efectivo, Transferencia"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Calificación (1-5 estrellas)</label>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">{formData.rating}/5</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notas Clave</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observaciones importantes, horarios especiales, descuentos..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editingSupplier ? "Guardar Cambios" : "Agregar Proveedor"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Title and search */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Directorio de Proveedores</h1>
        <p className="text-muted-foreground">Gestiona la información y evaluación de tus proveedores</p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, insumo o contacto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{suppliers.length}</p>
            <p className="text-sm text-blue-600">Total Proveedores</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{suppliers.filter(s => s.rating >= 4).length}</p>
            <p className="text-sm text-green-600">Excelentes (4-5)</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{suppliers.filter(s => s.rating === 3).length}</p>
            <p className="text-sm text-yellow-600">Buenos (3)</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{suppliers.filter(s => s.rating < 3).length}</p>
            <p className="text-sm text-red-600">Por Mejorar (1-2)</p>
          </CardContent>
        </Card>
      </div>

      {/* Suppliers grid */}
      {filteredSuppliers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            {searchTerm ? "No se encontraron proveedores con ese criterio." : "No hay proveedores registrados. Agrega uno para comenzar."}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{supplier.name}</CardTitle>
                    {renderStars(supplier.rating)}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(supplier)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700" onClick={() => deleteSupplier(supplier.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {supplier.contact_person && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4 shrink-0" />
                    <span className="truncate">{supplier.contact_person}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" />
                    <a href={`tel:${supplier.phone}`} className="hover:text-primary truncate">{supplier.phone}</a>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <a href={`mailto:${supplier.email}`} className="hover:text-primary truncate">{supplier.email}</a>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{supplier.address}</span>
                  </div>
                )}
                {supplier.supplies && (
                  <div className="flex items-start gap-2">
                    <Package className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                    <span className="font-medium text-foreground line-clamp-2">{supplier.supplies}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {supplier.delivery_days && (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      <Calendar className="w-3 h-3" /> {supplier.delivery_days}
                    </span>
                  )}
                  {supplier.payment_method && (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <CreditCard className="w-3 h-3" /> {supplier.payment_method}
                    </span>
                  )}
                </div>
                {supplier.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground italic line-clamp-3">{supplier.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
