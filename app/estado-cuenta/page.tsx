"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface AccountItem {
  id: number
  concept: string
  price: number
  payment: number
  sort_order: number
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function EstadoCuentaPage() {
  const [items, setItems] = useState<AccountItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ concept: "", price: 0, payment: 0 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({ concept: "", price: 0, payment: 0 })

  const loadItems = useCallback(async () => {
    try {
      const res = await fetch("/api/account-items")
      const data = await res.json()
      if (Array.isArray(data)) {
        setItems(data.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          payment: Number(item.payment) || 0,
        })))
      } else {
        setItems([])
      }
    } catch (error) {
      console.error("Error loading account items:", error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const handleAdd = async () => {
    if (!newItem.concept.trim()) return
    try {
      await fetch("/api/account-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, sort_order: items.length }),
      })
      setNewItem({ concept: "", price: 0, payment: 0 })
      setShowAddForm(false)
      loadItems()
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleEdit = (item: AccountItem) => {
    setEditingId(item.id)
    setEditForm({ concept: item.concept, price: item.price, payment: item.payment })
  }

  const handleSave = async () => {
    if (!editingId) return
    try {
      await fetch("/api/account-items", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editForm }),
      })
      setEditingId(null)
      loadItems()
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este concepto?")) return
    try {
      await fetch("/api/account-items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      loadItems()
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0)
  const totalPayment = items.reduce((sum, item) => sum + (item.payment || 0), 0)
  const balance = totalPrice - totalPayment

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f1] flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
          <div className="flex-1 flex justify-center">
            <Image src="/logo.png" alt="Los Cochirinos" width={160} height={40} className="h-10 w-auto" />
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Estado de Cuenta</h1>
          <p className="text-muted-foreground">Proyecto de Fachada - Los Cochirinos</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-background rounded-xl border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total del Proyecto</p>
            <p className="text-2xl font-bold text-foreground">{formatMoney(totalPrice)}</p>
          </div>
          <div className="bg-background rounded-xl border border-green-200 p-5 text-center">
            <p className="text-sm text-green-600 mb-1">Total Abonado</p>
            <p className="text-2xl font-bold text-green-700">{formatMoney(totalPayment)}</p>
          </div>
          <div className="bg-background rounded-xl border border-amber-200 p-5 text-center">
            <p className="text-sm text-amber-600 mb-1">Saldo Pendiente</p>
            <p className="text-2xl font-bold text-amber-700">{formatMoney(balance)}</p>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowAddForm(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Agregar Concepto
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Nuevo Concepto</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Concepto</label>
                  <Input
                    value={newItem.concept}
                    onChange={(e) => setNewItem({ ...newItem, concept: e.target.value })}
                    placeholder="Descripcion del concepto..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Precio</label>
                    <Input
                      type="number"
                      value={newItem.price || ""}
                      onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Abono</label>
                    <Input
                      type="number"
                      value={newItem.payment || ""}
                      onChange={(e) => setNewItem({ ...newItem, payment: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAdd}>Guardar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items List */}
        <div className="space-y-3 mb-8">
          {items.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No hay conceptos registrados. Agrega uno para comenzar.
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className={editingId === item.id ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-muted-foreground">Concepto</label>
                        <textarea
                          className="w-full border rounded-md px-3 py-2 text-sm resize-none"
                          value={editForm.concept}
                          onChange={(e) => setEditForm({ ...editForm, concept: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-muted-foreground">Precio</label>
                          <Input
                            type="number"
                            value={editForm.price || ""}
                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Abono</label>
                          <Input
                            type="number"
                            value={editForm.payment || ""}
                            onChange={(e) => setEditForm({ ...editForm, payment: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4 mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-1" /> Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <p className="text-sm text-foreground leading-relaxed flex-1">{item.concept}</p>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Precio</p>
                          <p className="text-base font-bold text-foreground tabular-nums">{formatMoney(item.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Abono</p>
                          {item.payment > 0 ? (
                            <p className="text-base font-bold text-green-700 tabular-nums">
                              {formatMoney(item.payment)}
                            </p>
                          ) : (
                            <p className="text-base text-muted-foreground">-</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Totals Card */}
        {items.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-foreground">Total</span>
                <span className="text-base font-bold text-foreground tabular-nums">{formatMoney(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-green-700">Abonado</span>
                <span className="text-base font-bold text-green-700 tabular-nums">{formatMoney(totalPayment)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-amber-800">Saldo Pendiente</span>
                <span className="text-lg font-bold text-amber-800 tabular-nums">{formatMoney(balance)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Para cualquier aclaracion, comunicarse con la administracion.
          </p>
        </div>
      </main>
    </div>
  )
}
