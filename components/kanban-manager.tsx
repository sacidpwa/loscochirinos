"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, ShoppingCart, Trash2, ListOrdered, Check, Pencil, Save } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import jsPDF from "jspdf"

interface Category {
  id: number
  name: string
}

interface Supply {
  id: number
  category_id: number
  category_name: string
  name: string
  purchase_frequency: string
  purchase_quantity: number
  minimum_stock: number
  unit: string // Added unit field
  supplier?: string // Added supplier field
  selected?: boolean
}

interface PurchaseOrder {
  id: number
  created_at: string
  completed_at: string | null
  total_amount: number
  item_count: number
}

interface OrderItem {
  id: number
  supply_name: string
  amount_spent: number
  notes: string
  checked: boolean
}

const COMMON_UNITS = ["unidad", "kg", "g", "l", "ml", "pza", "paquete", "caja", "otro"]

export function KanbanManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [supplies, setSupplies] = useState<Supply[]>([])
  const [selectedSupplies, setSelectedSupplies] = useState<Set<number>>(new Set())
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingSupply, setIsAddingSupply] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSupply, setNewSupply] = useState({ name: "", frequency: "", categoryId: 0, unit: "unidad" })
  const [view, setView] = useState<"kanban" | "orders" | "order-detail">("kanban")
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [currentOrder, setCurrentOrder] = useState<PurchaseOrder | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [editingCustomUnit, setEditingCustomUnit] = useState<number | null>(null)
  const [debounceTimers, setDebounceTimers] = useState<{ [key: string]: NodeJS.Timeout }>({})
  const [localValues, setLocalValues] = useState<{ [key: string]: string | number }>({})
  const [editingRows, setEditingRows] = useState<Set<number>>(new Set())

  const [loading, setLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [suppliesRes, categoriesRes] = await Promise.all([fetch("/api/supplies"), fetch("/api/categories")])
      const suppliesData = await suppliesRes.json()
      const categoriesData = await categoriesRes.json()

      setSupplies(suppliesData.map((s: Supply) => ({ ...s, selected: false })))
      setCategories(categoriesData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      })
      const newCategory = await res.json()
      setCategories([...categories, newCategory])
      setNewCategoryName("")
      setIsAddingCategory(false)
    } catch (error) {
      console.error("[v0] Error adding category:", error)
    }
  }

  const handleAddSupply = async () => {
    if (!newSupply.name.trim() || !newSupply.frequency.trim() || newSupply.categoryId === 0) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const res = await fetch("/api/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: newSupply.categoryId,
          name: newSupply.name,
          frequency: newSupply.frequency,
          unit: newSupply.unit,
        }),
      })
      await loadData()
      setNewSupply({ name: "", frequency: "", categoryId: 0, unit: "unidad" })
      setIsAddingSupply(false)
    } catch (error) {
      console.error("[v0] Error adding supply:", error)
    }
  }

  const debouncedUpdateSupply = (id: number, field: string, value: string | number) => {
    const key = `${id}-${field}`

    // Clear existing timer for this field
    if (debounceTimers[key]) {
      clearTimeout(debounceTimers[key])
    }

    // Update local state immediately for responsive UI
    setLocalValues((prev) => ({ ...prev, [key]: value }))

    // Set new timer to save to database
    const timer = setTimeout(() => {
      handleUpdateSupply(id, field, value)
      // Clean up timer from state
      setDebounceTimers((prev) => {
        const newTimers = { ...prev }
        delete newTimers[key]
        return newTimers
      })
    }, 800) // Wait 800ms after user stops typing

    setDebounceTimers((prev) => ({ ...prev, [key]: timer }))
  }

  const handleUpdateSupply = async (id: number, field: string, value: string | number) => {
    try {
      const supply = supplies.find((s) => s.id === id)
      if (!supply) return

      const updatedData = {
        id,
        name: field === "name" ? value : supply.name,
        frequency: field === "purchase_frequency" ? value : supply.purchase_frequency || "Semanal",
        purchase_quantity: field === "purchase_quantity" ? Number(value) : supply.purchase_quantity,
        minimum_stock: field === "minimum_stock" ? Number(value) : supply.minimum_stock,
        unit: field === "unit" ? value : supply.unit || "unidad",
        supplier: field === "supplier" ? value : supply.supplier || "",
      }

      await fetch("/api/supplies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      setSupplies(supplies.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    } catch (error) {
      console.error("[v0] Error updating supply:", error)
    }
  }

  const handleDeleteSupply = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este insumo?")) return

    try {
      await fetch("/api/supplies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      setSupplies(supplies.filter((s) => s.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting supply:", error)
    }
  }

  const handleSupplySelect = (id: number, checked: boolean) => {
    const newSelectedSupplies = new Set(selectedSupplies)
    if (checked) {
      newSelectedSupplies.add(id)
    } else {
      newSelectedSupplies.delete(id)
    }
    setSelectedSupplies(newSelectedSupplies)
  }

  const handleLocalChange = (id: number, field: string, value: string | number) => {
    setLocalValues((prev) => ({ ...prev, [`${id}-${field}`]: value }))
  }

  const toggleEditRow = (id: number) => {
    setEditingRows((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  const saveRow = async (supply: Supply) => {
    const id = supply.id
    const name = localValues[`${id}-name`] ?? supply.name
    const frequency = localValues[`${id}-frequency`] ?? supply.purchase_frequency
    const quantity = localValues[`${id}-quantity`] ?? supply.purchase_quantity
    const unit = localValues[`${id}-unit`] ?? supply.unit
    const minimum = localValues[`${id}-minimum`] ?? supply.minimum_stock
    const supplier = localValues[`${id}-supplier`] ?? supply.supplier

    try {
      await fetch("/api/supplies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: String(name),
          frequency: String(frequency || "Semanal"),
          purchase_quantity: Number(quantity),
          minimum_stock: Number(minimum),
          unit: String(unit || "unidad"),
          supplier: String(supplier || ""),
        }),
      })
      await loadData()
      // Clear local values for this row
      setLocalValues((prev) => {
        const next = { ...prev }
        for (const key of Object.keys(next)) {
          if (key.startsWith(`${id}-`)) delete next[key]
        }
        return next
      })
      setEditingRows((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } catch (error) {
      console.error("[v0] Error saving supply row:", error)
    }
  }

  const generateKanbanPDF = async () => {
    const selectedSuppliesData = supplies.filter((s) => selectedSupplies.has(s.id))

    if (selectedSuppliesData.length === 0) {
      alert("Por favor selecciona al menos un insumo para generar las tarjetas")
      return
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter",
    })

    const pageWidth = 215.9
    const pageHeight = 279.4
    const cardWidth = 95
    const cardHeight = 135 // Increased card height from 110 to 135 to make cards taller
    const marginLeft = 12
    const marginTop = 10
    const gapX = 13
    const gapY = 5 // Adjusted gap to fit taller cards in page

    let logoBase64: string | null = null
    try {
      const logoUrl = "/images/lc-20color-20sf.png"
      const response = await fetch(logoUrl)
      const blob = await response.blob()

      logoBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
      console.log("[v0] Logo converted to base64 successfully")
    } catch (error) {
      console.warn("[v0] Error loading logo:", error)
      logoBase64 = null
    }

    for (let i = 0; i < selectedSuppliesData.length; i++) {
      const supply = selectedSuppliesData[i]

      if (!supply || typeof supply !== "object") {
        console.error("[v0] Invalid supply object at index", i)
        continue
      }

      const position = i % 6
      const row = Math.floor(position / 2)
      const col = position % 2

      const colorIndex = i % backgroundColors.length
      const bgColor = backgroundColors[colorIndex] || [200, 200, 200]

      if (i > 0 && position === 0) {
        pdf.addPage()
      }

      const x = marginLeft + col * (cardWidth + gapX)
      const y = marginTop + row * (cardHeight + gapY)

      try {
        pdf.setFillColor(bgColor[0] || 200, bgColor[1] || 200, bgColor[2] || 200)
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "F")

        pdf.setDrawColor(0, 0, 0)
        pdf.setLineWidth(0.8)
        pdf.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "S")

        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(0, 0, 0)
        pdf.text("KANBAN", x + cardWidth / 2, y + 10, { align: "center" })

        pdf.setLineWidth(1.2)
        pdf.setDrawColor(0, 0, 0)
        pdf.line(x + 8, y + 12, x + cardWidth - 8, y + 12)

        let currentY = y + 20

        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(0, 0, 0)
        pdf.text("ITEM:", x + 6, currentY)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(20)
        const itemName = String(supply.name || "Sin nombre")
        const truncatedName = itemName.length > 18 ? itemName.substring(0, 18) + "..." : itemName
        pdf.text(truncatedName, x + 35, currentY + 6)
        pdf.setLineWidth(0.5)
        pdf.line(x + 6, currentY + 9, x + cardWidth - 6, currentY + 9)
        currentY += 15

        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(0, 0, 0)
        pdf.text("FRECUENCIA:", x + 6, currentY)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(20)
        const freqText = String(supply.frequency || "N/A")
        pdf.text(freqText.substring(0, 15), x + 35, currentY + 6)
        pdf.line(x + 6, currentY + 9, x + cardWidth - 6, currentY + 9)
        currentY += 15

        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(0, 0, 0)
        pdf.text("CANTIDAD:", x + 6, currentY)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(20)
        const qtyText = `${supply.purchase_quantity || 0} ${supply.unit || ""}`
        pdf.text(qtyText, x + 35, currentY + 6)
        pdf.line(x + 6, currentY + 9, x + cardWidth - 6, currentY + 9)
        currentY += 15

        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(0, 0, 0)
        pdf.text("MÍNIMO:", x + 6, currentY)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(20)
        pdf.text(String(supply.minimum_stock || 0), x + 35, currentY + 6)
        pdf.line(x + 6, currentY + 9, x + cardWidth - 6, currentY + 9)
        currentY += 15

        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(0, 0, 0)
        pdf.text("PROVEEDOR:", x + 6, currentY)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(20)
        const supplierText = String(supply.supplier || "")
        if (supplierText) {
          pdf.text(supplierText.substring(0, 12), x + 35, currentY + 6)
        }
        pdf.setLineWidth(0.5)
        pdf.line(x + 6, currentY + 9, x + cardWidth - 6, currentY + 9)
        currentY += 12

        if (logoBase64) {
          try {
            const logoWidth = 45
            const logoHeight = 32
            const logoX = x + (cardWidth - logoWidth) / 2
            const logoY = y + cardHeight - logoHeight - 8 // Moved logo further down with more space from bottom (from -4 to -8)
            pdf.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight)
          } catch (logoError) {
            console.warn("[v0] Error adding logo to PDF:", logoError)
          }
        }
      } catch (cardError) {
        console.error("[v0] Error rendering card for supply:", supply.name, cardError)
        continue
      }
    }

    pdf.save("tarjetas-kanban-cochirinos.pdf")
  }

  const createPurchaseOrder = async () => {
    const selectedSuppliesData = supplies.filter((s) => selectedSupplies.has(s.id))

    if (selectedSuppliesData.length === 0) {
      alert("Por favor selecciona al menos un insumo")
      return
    }

    const confirmed = window.confirm(
      `¿Deseas generar una orden de compra con ${selectedSuppliesData.length} insumo(s) seleccionado(s)?`,
    )

    if (!confirmed) {
      return
    }

    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supply_ids: selectedSuppliesData.map((s) => s.id) }),
      })

      const order = await res.json()

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      setSelectedSupplies(new Set())
    } catch (error) {
      console.error("Error creating purchase order:", error)
      alert("Error al crear la orden de compra")
    }
  }

  if (loading) {
    return <div className="py-16 text-center">Cargando...</div>
  }

  return (
    <section id="kanban" className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Gestor de Inventario Kanban</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Administra los insumos y genera tarjetas Kanban u órdenes de compra
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">
              ¡Orden de compra generada exitosamente!
            </AlertDescription>
          </Alert>
        )}

        {view === "kanban" && (
          <Card className="p-6">
            <div className="flex gap-4 mb-6 flex-wrap">
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nueva Categoría</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="category-name">Nombre de la Categoría</Label>
                      <Input
                        id="category-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Ej: Especias"
                      />
                    </div>
                    <Button onClick={handleAddCategory} className="w-full">
                      Guardar Categoría
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddingSupply} onOpenChange={setIsAddingSupply}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Insumo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Insumo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="supply-name">Nombre del Insumo</Label>
                      <Input
                        id="supply-name"
                        value={newSupply.name}
                        onChange={(e) => setNewSupply({ ...newSupply, name: e.target.value })}
                        placeholder="Ej: Achiote"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supply-category">Categoría</Label>
                      <Select
                        value={String(newSupply.categoryId)}
                        onValueChange={(value) => setNewSupply({ ...newSupply, categoryId: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="supply-frequency">Frecuencia de Compra</Label>
                      <Input
                        id="supply-frequency"
                        value={newSupply.frequency}
                        onChange={(e) => setNewSupply({ ...newSupply, frequency: e.target.value })}
                        placeholder="Ej: Mensual, Semanal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supply-unit">Unidad</Label>
                      <Select
                        value={newSupply.unit}
                        onValueChange={(value) => {
                          if (value === "otro") {
                            const customUnit = prompt("Ingresa la unidad personalizada:")
                            if (customUnit) {
                              setNewSupply({ ...newSupply, unit: customUnit })
                            }
                          } else {
                            setNewSupply({ ...newSupply, unit: value })
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_UNITS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {newSupply.unit === "otro" && (
                        <Input
                          className="mt-2"
                          placeholder="Escribe la unidad"
                          onChange={(e) => setNewSupply({ ...newSupply, unit: e.target.value })}
                        />
                      )}
                    </div>
                    <Button onClick={handleAddSupply} className="w-full">
                      Guardar Insumo
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={() => setView("orders")}>
                <ListOrdered className="w-4 h-4 mr-2" />
                Órdenes de Compra
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Seleccionar</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Mínimo</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="w-[50px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <React.Fragment key={`category-${category.id}`}>
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={9} className="font-bold text-sm">
                          {category.name.toUpperCase()}
                        </TableCell>
                      </TableRow>
                      {supplies
                        .filter((s) => s.category_id === category.id)
                        .map((supply) => {
                          const isEditing = editingRows.has(supply.id)
                          return (
                          <TableRow key={supply.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedSupplies.has(supply.id)}
                                onCheckedChange={(checked) => handleSupplySelect(supply.id, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell className="text-sm">{category.name}</TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={localValues[`${supply.id}-name`] ?? (supply.name || "")}
                                  onChange={(e) => handleLocalChange(supply.id, "name", e.target.value)}
                                  className="min-w-[150px]"
                                />
                              ) : (
                                <span className="font-medium">{supply.name}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <select
                                  value={localValues[`${supply.id}-frequency`] ?? (supply.purchase_frequency || "")}
                                  onChange={(e) => handleLocalChange(supply.id, "frequency", e.target.value)}
                                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                >
                                  <option value="">Seleccionar...</option>
                                  <option value="Diario">Diario</option>
                                  <option value="Tercer día">Tercer día</option>
                                  <option value="Semanal">Semanal</option>
                                  <option value="Quincenal">Quincenal</option>
                                  <option value="Mensual">Mensual</option>
                                  <option value="Bimestral">Bimestral</option>
                                  <option value="Trimestral">Trimestral</option>
                                  <option value="Semestral">Semestral</option>
                                  <option value="Anual">Anual</option>
                                </select>
                              ) : (
                                <span>{supply.purchase_frequency || "-"}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={localValues[`${supply.id}-quantity`] ?? (supply.purchase_quantity || "")}
                                  onChange={(e) => handleLocalChange(supply.id, "quantity", e.target.value)}
                                  className="w-24"
                                />
                              ) : (
                                <span>{supply.purchase_quantity || 0}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <select
                                  value={localValues[`${supply.id}-unit`] ?? (supply.unit || "unidad")}
                                  onChange={(e) => handleLocalChange(supply.id, "unit", e.target.value)}
                                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                                >
                                  <option value="kg">kg</option>
                                  <option value="g">g</option>
                                  <option value="l">l</option>
                                  <option value="ml">ml</option>
                                  <option value="pza">pza</option>
                                  <option value="caja">caja</option>
                                  <option value="paquete">paquete</option>
                                  <option value="bolsa">bolsa</option>
                                  <option value="unidad">unidad</option>
                                </select>
                              ) : (
                                <span>{supply.unit || "unidad"}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={localValues[`${supply.id}-minimum`] ?? (supply.minimum_stock || "")}
                                  onChange={(e) => handleLocalChange(supply.id, "minimum", e.target.value)}
                                  className="w-20"
                                />
                              ) : (
                                <span>{supply.minimum_stock || 0}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {isEditing ? (
                                <Input
                                  value={localValues[`${supply.id}-supplier`] ?? (supply.supplier || "")}
                                  onChange={(e) => handleLocalChange(supply.id, "supplier", e.target.value)}
                                  className="w-32"
                                  placeholder="Proveedor"
                                />
                              ) : (
                                <span>{supply.supplier || "-"}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {isEditing ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-800 hover:bg-green-50 h-8 w-8 p-0"
                                    onClick={() => saveRow(supply)}
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                                    onClick={() => toggleEditRow(supply.id)}
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                  onClick={() => handleDeleteSupply(supply.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          )
                        })}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={generateKanbanPDF} disabled={selectedSupplies.size === 0}>
                <Download className="w-4 h-4 mr-2" />
                Generar Tarjetas Kanban
              </Button>
              <Button onClick={createPurchaseOrder} disabled={selectedSupplies.size === 0} variant="secondary">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Generar Orden de Compra
              </Button>
            </div>
          </Card>
        )}

        {view === "orders" && (
          <PurchaseOrdersList
            open={true}
            onOpenChange={() => setView("kanban")}
            orders={orders}
            setOrders={setOrders}
            setCurrentOrder={setCurrentOrder}
            setView={setView}
          />
        )}

        {view === "order-detail" && currentOrder && (
          <PurchaseOrderDetail
            orderId={currentOrder.id}
            onBack={() => {
              setCurrentOrder(null)
              setView("orders")
            }}
            open={true}
            onOpenChange={() => setView("orders")}
            orderItems={orderItems}
            setOrderItems={setOrderItems}
          />
        )}
      </div>
    </section>
  )
}

function PurchaseOrdersList({
  open,
  onOpenChange,
  orders,
  setOrders,
  setCurrentOrder,
  setView,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  orders: PurchaseOrder[]
  setOrders: (orders: PurchaseOrder[]) => void
  setCurrentOrder: (order: PurchaseOrder | null) => void
  setView: (view: "kanban" | "orders" | "order-detail") => void
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadOrders()
    }
  }, [open])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/purchase-orders")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("[v0] Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click

    if (!confirm("¿Estás seguro de eliminar esta orden de compra?")) return

    try {
      await fetch(`/api/purchase-orders/${orderId}`, {
        method: "DELETE",
      })

      setOrders(orders.filter((o) => o.id !== orderId))
    } catch (error) {
      console.error("[v0] Error deleting order:", error)
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Cargando órdenes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No hay órdenes de compra generadas</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const isCompleted = order.completed_at !== null

            return (
              <Card
                key={order.id}
                className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors relative ${
                  isCompleted ? "bg-green-50 border-green-200" : ""
                }`}
                onClick={() => {
                  setCurrentOrder(order)
                  setView("order-detail")
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleDeleteOrder(order.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <div className="flex justify-between items-start pr-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">Orden #{order.id}</h3>
                      {isCompleted && (
                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3" />
                          Completada
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Creada: {new Date(order.created_at).toLocaleDateString("es-MX")}
                    </p>
                    {order.completed_at && (
                      <p className="text-sm text-green-600 font-medium">
                        Completada: {new Date(order.completed_at).toLocaleDateString("es-MX")}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">${Number(order.total_amount || 0).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{order.item_count} insumos</p>
                    {!isCompleted && (
                      <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PurchaseOrderDetail({
  orderId,
  onBack,
  orderItems,
  setOrderItems,
}: {
  orderId: number
  onBack: () => void
  orderItems: OrderItem[]
  setOrderItems: (orderItems: OrderItem[]) => void
}) {
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<{
    created_at?: string
    completed_at?: string
    status?: string
  } | null>(null)

  useEffect(() => {
    loadOrderDetail()
  }, [orderId])

  const loadOrderDetail = async () => {
    try {
      const [orderRes, itemsRes] = await Promise.all([
        fetch(`/api/purchase-orders/${orderId}`),
        fetch(`/api/purchase-orders/${orderId}/items`),
      ])

      const orderInfo = await orderRes.json()
      const itemsData = await itemsRes.json()

      setOrderData(orderInfo)
      setOrderItems(Array.isArray(itemsData) ? itemsData : [])
    } catch (error) {
      console.error("[v0] Error loading order detail:", error)
      setOrderItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = async (itemId: number, field: string, value: any) => {
    try {
      const item = orderItems.find((i) => i.id === itemId)
      if (!item) return

      const updatedData = {
        item_id: itemId,
        checked: field === "checked" ? value : item.checked,
        amount_spent: field === "amount_spent" ? Number(value) : item.amount_spent,
        notes: field === "notes" ? value : item.notes,
      }

      await fetch(`/api/purchase-orders/${orderId}/items`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })

      setOrderItems(orderItems.map((i) => (i.id === itemId ? { ...i, [field]: value } : i)))

      const allChecked = orderItems.every((i) => (i.id === itemId ? value : i.checked))
      if (allChecked && field === "checked" && value) {
        await fetch(`/api/purchase-orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true }),
        })
        loadOrderDetail()
      }
    } catch (error) {
      console.error("[v0] Error updating item:", error)
    }
  }

  const totalSpent = orderItems.reduce((sum, item) => sum + Number(item.amount_spent || 0), 0)

  if (loading) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Volver
        </Button>
        <h2 className="font-semibold text-lg">Orden de Compra #{orderId}</h2>
      </div>

      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">Fecha de creación</p>
          <p className="font-semibold">
            {orderData?.created_at
              ? new Date(orderData.created_at).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Sin fecha"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Fecha de completado</p>
          <p className="font-semibold text-green-600">
            {orderData?.completed_at
              ? new Date(orderData.completed_at).toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Pendiente"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total gastado</p>
          <p className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">✓</TableHead>
              <TableHead>Insumo</TableHead>
              <TableHead>Gasto ($)</TableHead>
              <TableHead>Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.id} className={item.checked ? "bg-green-50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) => handleUpdateItem(item.id, "checked", checked)}
                  />
                </TableCell>
                <TableCell className={item.checked ? "line-through text-muted-foreground" : "font-medium"}>
                  {item.supply_name}
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.amount_spent || ""}
                    onChange={(e) => handleUpdateItem(item.id, "amount_spent", e.target.value)}
                    placeholder="0.00"
                    className="w-32"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) => handleUpdateItem(item.id, "notes", e.target.value)}
                    placeholder="Notas..."
                    className="w-full"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

const backgroundColors = [
  [76, 175, 80], // Verde
  [255, 87, 34], // Naranja
  [255, 235, 59], // Amarillo
  [33, 150, 243], // Azul
  [156, 39, 176], // Morado
  [0, 188, 212], // Cyan
]
