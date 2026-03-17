"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Trash2,
  ArrowLeft,
  Camera,
  FileText,
  ChefHat,
  UtensilsCrossed,
  X,
  Download,
} from "lucide-react"

// ── Types ───────────────────────────────────────────────────────────
interface Recipe {
  id: number
  name: string
  notes: string
  photo_url: string
  created_at: string
}

interface Ingredient {
  id: number
  recipe_id: number
  name: string
  quantity: string
  unit: string
  photo_url: string
  sort_order: number
}

interface RecipeProcess {
  id: number
  recipe_id: number
  stage: string
  description: string
  photo_url: string
  sort_order: number
}

const PHASES = [
  { value: "inicial", label: "Inicial", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { value: "intermedio", label: "Intermedio", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "final", label: "Final", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "posterior", label: "Posterior", color: "bg-rose-100 text-rose-800 border-rose-300" },
]

// ── Photo Upload Helper ─────────────────────────────────────────────
function PhotoUploader({
  currentUrl,
  onUploaded,
  label,
}: {
  currentUrl: string
  onUploaded: (url: string) => void
  label: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await res.json()
      if (data.url) onUploaded(data.url)
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
        }}
      />
      {currentUrl ? (
        <div className="relative group">
          <Image
            src={currentUrl}
            alt={label}
            width={200}
            height={150}
            className="w-full h-32 object-cover rounded-lg border"
          />
          <button
            type="button"
            className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onUploaded("")}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <Camera className="w-6 h-6" />
          <span className="text-xs">{uploading ? "Subiendo..." : label}</span>
        </button>
      )}
      {currentUrl && (
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          <Camera className="w-3 h-3 mr-1" />
          {uploading ? "Subiendo..." : "Cambiar foto"}
        </Button>
      )}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────
export function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newName, setNewName] = useState("")

  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    try {
      const res = await fetch("/api/recipes")
      const data = await res.json()
      setRecipes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading recipes:", err)
    } finally {
      setLoading(false)
    }
  }

  const createRecipe = async () => {
    if (!newName.trim()) return
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      })
      const recipe = await res.json()
      setRecipes((prev) => [recipe, ...prev])
      setNewName("")
      setShowNewForm(false)
      setSelectedRecipe(recipe.id)
    } catch (err) {
      console.error("Error creating recipe:", err)
    }
  }

  const deleteRecipe = async (id: number) => {
    if (!confirm("Eliminar esta receta y todos sus datos?")) return
    try {
      await fetch(`/api/recipes/${id}`, { method: "DELETE" })
      setRecipes((prev) => prev.filter((r) => r.id !== id))
      if (selectedRecipe === id) setSelectedRecipe(null)
    } catch (err) {
      console.error("Error deleting recipe:", err)
    }
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipeId={selectedRecipe}
        onBack={() => {
          setSelectedRecipe(null)
          loadRecipes()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-primary" />
            Recetas Estandarizadas
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Registra y estandariza las recetas de Los Cochirinos
          </p>
        </div>
        <Button onClick={() => setShowNewForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Nueva Receta
        </Button>
      </div>

      {/* New recipe form */}
      {showNewForm && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Nombre del platillo..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createRecipe()}
                className="flex-1 text-lg"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={createRecipe} disabled={!newName.trim()}>
                  Crear
                </Button>
                <Button variant="outline" onClick={() => { setShowNewForm(false); setNewName("") }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipe list */}
      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Cargando recetas...</p>
      ) : recipes.length === 0 && !showNewForm ? (
        <Card>
          <CardContent className="text-center py-16">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No hay recetas registradas</p>
            <p className="text-sm text-muted-foreground mt-1">Crea tu primera receta estandarizada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="cursor-pointer hover:border-primary transition-colors group"
              onClick={() => setSelectedRecipe(recipe.id)}
            >
              <CardContent className="p-4">
                {recipe.photo_url ? (
                  <Image
                    src={recipe.photo_url}
                    alt={recipe.name}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-muted rounded-lg mb-3 flex items-center justify-center">
                    <ChefHat className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                      {recipe.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(recipe.created_at).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                    onClick={(e) => { e.stopPropagation(); deleteRecipe(recipe.id) }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Recipe Detail ───────────────────────────────────────────────────
function RecipeDetail({ recipeId, onBack }: { recipeId: number; onBack: () => void }) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [processes, setProcesses] = useState<RecipeProcess[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)

  // New ingredient state
  const [newIngName, setNewIngName] = useState("")
  const [newIngQty, setNewIngQty] = useState("")
  const [newIngUnit, setNewIngUnit] = useState("")
  const [newIngPhoto, setNewIngPhoto] = useState("")

  // New process state
  const [newProcPhase, setNewProcPhase] = useState("inicial")
  const [newProcDesc, setNewProcDesc] = useState("")
  const [newProcPhoto, setNewProcPhoto] = useState("")

  useEffect(() => {
    loadRecipe()
  }, [recipeId])

  const loadRecipe = async () => {
    try {
      const res = await fetch(`/api/recipes/${recipeId}`)
      const data = await res.json()
      setRecipe(data)
      setIngredients(data.ingredients || [])
      setProcesses(data.processes || [])
      setNotes(data.key_comments || "")
    } catch (err) {
      console.error("Error loading recipe:", err)
    } finally {
      setLoading(false)
    }
  }

  const saveNotes = async () => {
    if (!recipe) return
    setSavingNotes(true)
    try {
      await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: recipe.name, key_comments: notes, photo_url: recipe.photo_url }),
      })
    } catch (err) {
      console.error("Error saving key_comments:", err)
    } finally {
      setSavingNotes(false)
    }
  }

  const updateRecipePhoto = async (url: string) => {
    if (!recipe) return
    try {
      await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: recipe.name, key_comments: notes, photo_url: url }),
      })
      setRecipe({ ...recipe, photo_url: url })
    } catch (err) {
      console.error("Error updating recipe photo:", err)
    }
  }

  // ── Ingredients CRUD ──
  const addIngredient = async () => {
    if (!newIngName.trim()) return
    try {
      const res = await fetch(`/api/recipes/${recipeId}/ingredients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newIngName.trim(),
          quantity: newIngQty,
          unit: newIngUnit,
          photo_url: newIngPhoto,
          sort_order: ingredients.length,
        }),
      })
      const ing = await res.json()
      setIngredients((prev) => [...prev, ing])
      setNewIngName("")
      setNewIngQty("")
      setNewIngUnit("")
      setNewIngPhoto("")
    } catch (err) {
      console.error("Error adding ingredient:", err)
    }
  }

  const deleteIngredient = async (id: number) => {
    try {
      await fetch(`/api/recipes/${recipeId}/ingredients`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredient_id: id }),
      })
      setIngredients((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      console.error("Error deleting ingredient:", err)
    }
  }

  // ── Processes CRUD ──
  const addProcess = async () => {
    if (!newProcDesc.trim()) return
    try {
      const res = await fetch(`/api/recipes/${recipeId}/processes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: newProcPhase,
          description: newProcDesc.trim(),
          photo_url: newProcPhoto,
          sort_order: processes.filter((p) => p.stage === newProcPhase).length,
        }),
      })
      const proc = await res.json()
      setProcesses((prev) => [...prev, proc])
      setNewProcDesc("")
      setNewProcPhoto("")
    } catch (err) {
      console.error("Error adding process:", err)
    }
  }

  const deleteProcess = async (id: number) => {
    try {
      await fetch(`/api/recipes/${recipeId}/processes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ process_id: id }),
      })
      setProcesses((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Error deleting process:", err)
    }
  }

  // ── Generate PDF ──
  const generatePDF = async () => {
    if (!recipe) return
    const { jsPDF } = await import("jspdf")
    const pdf = new jsPDF("p", "mm", "letter")
    const pageW = pdf.internal.pageSize.getWidth()
    const margin = 15
    const contentW = pageW - margin * 2
    let y = margin

    // Helper to load image as base64
    const loadImageBase64 = async (url: string): Promise<string | null> => {
      try {
        const response = await fetch(url)
        const blob = await response.blob()
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = () => resolve(null)
          reader.readAsDataURL(blob)
        })
      } catch {
        return null
      }
    }

    const checkPageBreak = (needed: number) => {
      if (y + needed > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage()
        y = margin
      }
    }

    // ── Logo ──
    const logoUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LC%20COLOR%20SF-LjHQDAlTNFBPhIACopKiGDlaBsRmMV.png"
    const logoBase64 = await loadImageBase64(logoUrl)
    if (logoBase64) {
      const logoW = 45
      const logoH = 32
      pdf.addImage(logoBase64, "PNG", (pageW - logoW) / 2, y, logoW, logoH)
      y += logoH + 5
    }

    // ── Title ──
    pdf.setFontSize(20)
    pdf.setFont("helvetica", "bold")
    pdf.text("HOJA DE TRABAJO ESTANDARIZADA", pageW / 2, y, { align: "center" })
    y += 10

    pdf.setFontSize(16)
    pdf.text(recipe.name.toUpperCase(), pageW / 2, y, { align: "center" })
    y += 4
    pdf.setDrawColor(0, 128, 128)
    pdf.setLineWidth(0.5)
    pdf.line(margin, y, pageW - margin, y)
    y += 8

    // ── Recipe photo ──
    if (recipe.photo_url) {
      const recipeImg = await loadImageBase64(recipe.photo_url)
      if (recipeImg) {
        checkPageBreak(65)
        const imgW = 80
        const imgH = 60
        pdf.addImage(recipeImg, "JPEG", (pageW - imgW) / 2, y, imgW, imgH)
        y += imgH + 8
      }
    }

    // ── Ingredients Section ──
    checkPageBreak(20)
    pdf.setFillColor(0, 128, 128)
    pdf.rect(margin, y, contentW, 8, "F")
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(255, 255, 255)
    pdf.text("INGREDIENTES", pageW / 2, y + 5.5, { align: "center" })
    pdf.setTextColor(0, 0, 0)
    y += 12

    for (const ing of ingredients) {
      checkPageBreak(ing.photo_url ? 45 : 10)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "bold")
      pdf.text(`${ing.name}`, margin + 2, y + 4)
      pdf.setFont("helvetica", "normal")
      pdf.text(`${ing.quantity} ${ing.unit}`, margin + 80, y + 4)

      if (ing.photo_url) {
        const ingImg = await loadImageBase64(ing.photo_url)
        if (ingImg) {
          y += 6
          pdf.addImage(ingImg, "JPEG", margin + 2, y, 30, 25)
          y += 27
        } else {
          y += 8
        }
      } else {
        y += 8
      }
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(0.2)
      pdf.line(margin, y, pageW - margin, y)
      y += 2
    }

    // ── Processes by phase ──
    for (const phase of PHASES) {
      const phaseProcesses = processes.filter((p) => p.stage === phase.value)
      if (phaseProcesses.length === 0) continue

      checkPageBreak(20)
      y += 4
      pdf.setFillColor(0, 128, 128)
      pdf.rect(margin, y, contentW, 8, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(255, 255, 255)
      pdf.text(`PROCESO ${phase.label.toUpperCase()}`, pageW / 2, y + 5.5, { align: "center" })
      pdf.setTextColor(0, 0, 0)
      y += 12

      for (let i = 0; i < phaseProcesses.length; i++) {
        const proc = phaseProcesses[i]
        checkPageBreak(proc.photo_url ? 55 : 15)

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")
        pdf.text(`Paso ${i + 1}:`, margin + 2, y + 4)
        pdf.setFont("helvetica", "normal")

        const descLines = pdf.splitTextToSize(proc.description, contentW - 25)
        pdf.text(descLines, margin + 20, y + 4)
        y += descLines.length * 5 + 2

        if (proc.photo_url) {
          const procImg = await loadImageBase64(proc.photo_url)
          if (procImg) {
            checkPageBreak(45)
            pdf.addImage(procImg, "JPEG", (pageW - 60) / 2, y, 60, 40)
            y += 42
          }
        }

        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.2)
        pdf.line(margin, y, pageW - margin, y)
        y += 4
      }
    }

    // ── Notes ──
    if (notes.trim()) {
      checkPageBreak(20)
      y += 4
      pdf.setFillColor(0, 128, 128)
      pdf.rect(margin, y, contentW, 8, "F")
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(255, 255, 255)
      pdf.text("COMENTARIOS CLAVE", pageW / 2, y + 5.5, { align: "center" })
      pdf.setTextColor(0, 0, 0)
      y += 12

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      const noteLines = pdf.splitTextToSize(notes, contentW - 4)
      checkPageBreak(noteLines.length * 5 + 5)
      pdf.text(noteLines, margin + 2, y + 4)
      y += noteLines.length * 5 + 8
    }

    // ── Footer logo on every page ──
    const totalPages = pdf.getNumberOfPages()
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p)
      const pageH = pdf.internal.pageSize.getHeight()
      if (logoBase64) {
        pdf.addImage(logoBase64, "PNG", (pageW - 30) / 2, pageH - 20, 30, 22)
      }
      pdf.setFontSize(7)
      pdf.setTextColor(150, 150, 150)
      pdf.text("Los Cochirinos - Especialistas en Cochinita Pibil", pageW / 2, pageH - 3, { align: "center" })
      pdf.setTextColor(0, 0, 0)
    }

    pdf.save(`Receta-${recipe.name.replace(/\s+/g, "-")}.pdf`)
  }

  if (loading) {
    return <p className="text-center py-12 text-muted-foreground">Cargando receta...</p>
  }

  if (!recipe) {
    return <p className="text-center py-12 text-muted-foreground">Receta no encontrada</p>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="outline" size="sm" onClick={onBack} className="shrink-0">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold truncate">{recipe.name}</h2>
        </div>
        <Button onClick={generatePDF} className="gap-2 w-full sm:w-auto" variant="default">
          <Download className="w-4 h-4 shrink-0" />
          <span className="truncate">Generar Hoja de Trabajo</span>
        </Button>
      </div>

      {/* Recipe photo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="w-5 h-5" /> Foto del Platillo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <PhotoUploader
              currentUrl={recipe.photo_url || ""}
              onUploaded={updateRecipePhoto}
              label="Foto del platillo"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Ingredients ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" /> Ingredientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing ingredients */}
          {ingredients.length > 0 && (
            <div className="space-y-3">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  {ing.photo_url && (
                    <Image
                      src={ing.photo_url}
                      alt={ing.name}
                      width={60}
                      height={60}
                      className="w-14 h-14 object-cover rounded-md shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{ing.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ing.quantity} {ing.unit}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-700 h-8 w-8"
                    onClick={() => deleteIngredient(ing.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add ingredient form */}
          <div className="border rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Agregar ingrediente</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                placeholder="Nombre del ingrediente"
                value={newIngName}
                onChange={(e) => setNewIngName(e.target.value)}
              />
              <Input
                placeholder="Cantidad (ej: 500)"
                value={newIngQty}
                onChange={(e) => setNewIngQty(e.target.value)}
              />
              <Input
                placeholder="Unidad (ej: g, ml, pza)"
                value={newIngUnit}
                onChange={(e) => setNewIngUnit(e.target.value)}
              />
            </div>
            <div className="max-w-[200px]">
              <PhotoUploader
                currentUrl={newIngPhoto}
                onUploaded={setNewIngPhoto}
                label="Foto ingrediente"
              />
            </div>
            <Button size="sm" onClick={addIngredient} disabled={!newIngName.trim()} className="gap-1">
              <Plus className="w-4 h-4" /> Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Processes ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" /> Procesos de Preparacion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Show existing processes grouped by phase */}
          {PHASES.map((phase) => {
              const phaseProcs = processes.filter((p) => p.stage === phase.value)
            if (phaseProcs.length === 0) return null
            return (
              <div key={phase.value}>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border mb-3 ${phase.color}`}>
                  {phase.label}
                </div>
                <div className="space-y-3 ml-2">
                  {phaseProcs.map((proc, idx) => (
                    <div key={proc.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      {proc.photo_url && (
                        <Image
                          src={proc.photo_url}
                          alt={`Paso ${idx + 1}`}
                          width={80}
                          height={60}
                          className="w-20 h-16 object-cover rounded-md shrink-0"
                        />
                      )}
                      <p className="flex-1 text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {proc.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-red-500 hover:text-red-700 h-8 w-8"
                        onClick={() => deleteProcess(proc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Add process form */}
          <div className="border rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Agregar proceso</p>
            <div className="flex flex-wrap gap-2">
              {PHASES.map((phase) => (
                <button
                  key={phase.value}
                  type="button"
                  onClick={() => setNewProcPhase(phase.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                    newProcPhase === phase.value
                      ? phase.color + " ring-2 ring-offset-1 ring-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Describe el paso del proceso..."
              value={newProcDesc}
              onChange={(e) => setNewProcDesc(e.target.value)}
              rows={3}
            />
            <div className="max-w-[200px]">
              <PhotoUploader
                currentUrl={newProcPhoto}
                onUploaded={setNewProcPhoto}
                label="Foto del proceso"
              />
            </div>
            <Button size="sm" onClick={addProcess} disabled={!newProcDesc.trim()} className="gap-1">
              <Plus className="w-4 h-4" /> Agregar Proceso
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Notes ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comentarios Clave</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Tips, notas importantes, observaciones del platillo..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <Button variant="outline" size="sm" onClick={saveNotes} disabled={savingNotes}>
            {savingNotes ? "Guardando..." : "Guardar comentarios"}
          </Button>
        </CardContent>
      </Card>

      {/* ── Generate PDF button at bottom ── */}
      <div className="flex justify-center px-4 pb-8">
        <Button
          size="lg"
          onClick={generatePDF}
          className="gap-2 w-full sm:w-auto text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6 whitespace-normal text-center"
        >
          <Download className="w-5 h-5 shrink-0" />
          <span>Generar Hoja de Trabajo Estandarizada</span>
        </Button>
      </div>
    </div>
  )
}
