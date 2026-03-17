"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Pencil, Save, X, Download } from "lucide-react"
import Image from "next/image"
import jsPDF from "jspdf"

interface FlowStep {
  id: number
  label: string
  shape: "terminator" | "process" | "decision"
  sort_order: number
}

// Phase colors - assigned by step position (excluding terminators)
const phaseConfig = [
  { name: "Llegada y Preparacion", color: "border-amber-500 bg-amber-50", textColor: "text-amber-800", badge: "bg-amber-500", pdfFill: [255, 243, 224], pdfStroke: [245, 158, 11] },
  { name: "Cocina", color: "border-orange-500 bg-orange-50", textColor: "text-orange-800", badge: "bg-orange-500", pdfFill: [255, 237, 213], pdfStroke: [234, 88, 12] },
  { name: "Servicio y Recepcion", color: "border-teal-500 bg-teal-50", textColor: "text-teal-800", badge: "bg-teal-500", pdfFill: [204, 251, 241], pdfStroke: [13, 148, 136] },
]

function getPhaseIndex(stepIndex: number, totalProcesses: number): number {
  if (totalProcesses <= 0) return 0
  const third = totalProcesses / 3
  if (stepIndex < third) return 0
  if (stepIndex < third * 2) return 1
  return 2
}

export function FlowDiagram() {
  const [steps, setSteps] = useState<FlowStep[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editShape, setEditShape] = useState<FlowStep["shape"]>("process")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLabel, setNewLabel] = useState("")
  const [newShape, setNewShape] = useState<FlowStep["shape"]>("process")
  const [newPosition, setNewPosition] = useState<number>(1)

  const loadSteps = useCallback(async () => {
    try {
      const res = await fetch("/api/flow-steps")
      const data = await res.json()
      setSteps(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error loading flow steps:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadSteps() }, [loadSteps])

  // Get the total number of process steps (non-terminator) for numbering
  const processSteps = steps.filter((s) => s.shape !== "terminator")
  const totalProcesses = processSteps.length

  const addStep = async () => {
    if (!newLabel.trim()) return
    // Position is 1-based for user; sort_order is 0-based internally
    // We need to find the actual sort_order position considering terminators
    // Position 1 means after the first terminator (INICIO)
    const firstTerminator = steps.find((s) => s.shape === "terminator")
    const baseOrder = firstTerminator ? firstTerminator.sort_order + 1 : 0
    const targetOrder = baseOrder + newPosition - 1

    try {
      await fetch("/api/flow-steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim(), shape: newShape, sort_order: targetOrder }),
      })
      setNewLabel("")
      setNewShape("process")
      setShowAddForm(false)
      await loadSteps()
    } catch (err) {
      console.error("Error adding step:", err)
    }
  }

  const updateStep = async (id: number) => {
    if (!editLabel.trim()) return
    try {
      await fetch("/api/flow-steps", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, label: editLabel.trim(), shape: editShape }),
      })
      setEditingId(null)
      await loadSteps()
    } catch (err) {
      console.error("Error updating step:", err)
    }
  }

  const deleteStep = async (id: number) => {
    try {
      await fetch("/api/flow-steps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await loadSteps()
    } catch (err) {
      console.error("Error deleting step:", err)
    }
  }

  const startEdit = (step: FlowStep) => {
    setEditingId(step.id)
    setEditLabel(step.label)
    setEditShape(step.shape)
  }

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const centerX = pageW / 2
    let y = 20

    const logoImg = new window.Image()
    logoImg.crossOrigin = "anonymous"
    logoImg.src = "/logo.png"
    logoImg.onload = () => {
      doc.addImage(logoImg, "PNG", centerX - 25, y, 50, 15)
      y += 22
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("Diagrama de Flujo", centerX, y, { align: "center" })
      y += 6
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Apertura Operativa", centerX, y, { align: "center" })
      y += 14

      const shapeW = 74
      const shapeH = 14
      const arrowH = 8
      let procIdx = 0

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]

        if (y + shapeH + arrowH + 5 > pageH - 20) {
          doc.addPage()
          y = 20
        }

        if (step.shape === "terminator") {
          doc.setFillColor(26, 26, 26)
          doc.ellipse(centerX, y + shapeH / 2, shapeW / 2, shapeH / 2, "F")
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(10)
          doc.setFont("helvetica", "bold")
          doc.text(step.label.toUpperCase(), centerX, y + shapeH / 2 + 1, { align: "center" })
        } else if (step.shape === "decision") {
          const phase = phaseConfig[getPhaseIndex(procIdx, totalProcesses)]
          const cx = centerX
          const cy = y + shapeH / 2 + 2
          const hw = shapeW / 2
          const hh = (shapeH + 4) / 2
          doc.setFillColor(phase.pdfFill[0], phase.pdfFill[1], phase.pdfFill[2])
          doc.setDrawColor(phase.pdfStroke[0], phase.pdfStroke[1], phase.pdfStroke[2])
          doc.setLineWidth(0.6)
          // Draw diamond manually
          doc.moveTo(cx, cy - hh)
          doc.lineTo(cx + hw, cy)
          doc.lineTo(cx, cy + hh)
          doc.lineTo(cx - hw, cy)
          doc.lineTo(cx, cy - hh)
          doc.fillStroke()
          doc.setTextColor(0, 0, 0)
          doc.setFontSize(8)
          doc.setFont("helvetica", "normal")
          doc.text(`${procIdx + 1}. ${step.label}`, cx, cy + 1, { align: "center", maxWidth: shapeW - 16 })
          procIdx++
        } else {
          const phase = phaseConfig[getPhaseIndex(procIdx, totalProcesses)]
          const x1 = centerX - shapeW / 2
          doc.setFillColor(phase.pdfFill[0], phase.pdfFill[1], phase.pdfFill[2])
          doc.setDrawColor(phase.pdfStroke[0], phase.pdfStroke[1], phase.pdfStroke[2])
          doc.setLineWidth(0.5)
          doc.roundedRect(x1, y, shapeW, shapeH, 2, 2, "FD")
          doc.setTextColor(0, 0, 0)
          doc.setFontSize(8)
          doc.setFont("helvetica", "normal")
          doc.text(`${procIdx + 1}. ${step.label}`, centerX, y + shapeH / 2 + 1, { align: "center", maxWidth: shapeW - 8 })
          procIdx++
        }

        y += step.shape === "decision" ? shapeH + 4 : shapeH

        if (i < steps.length - 1) {
          doc.setDrawColor(100, 100, 100)
          doc.setLineWidth(0.3)
          doc.line(centerX, y, centerX, y + arrowH - 2)
          doc.setFillColor(100, 100, 100)
          doc.triangle(centerX, y + arrowH, centerX - 1.5, y + arrowH - 3, centerX + 1.5, y + arrowH - 3, "F")
          y += arrowH
        }
      }

      // Legend
      y += 12
      if (y > pageH - 40) { doc.addPage(); y = 20 }
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(100, 100, 100)
      doc.text("SIMBOLOGIA:", 20, y)
      y += 6
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setFillColor(26, 26, 26)
      doc.ellipse(27, y, 6, 2.5, "F")
      doc.setTextColor(0, 0, 0)
      doc.text("= Inicio / Fin", 35, y + 1)
      y += 7
      doc.setFillColor(240, 253, 244)
      doc.setDrawColor(34, 139, 34)
      doc.roundedRect(21, y - 2.5, 12, 5, 1, 1, "FD")
      doc.text("= Proceso", 35, y + 1)
      y += 7
      const dy = y
      doc.setFillColor(255, 243, 224)
      doc.setDrawColor(245, 158, 11)
      doc.moveTo(27, dy - 3)
      doc.lineTo(33, dy)
      doc.lineTo(27, dy + 3)
      doc.lineTo(21, dy)
      doc.lineTo(27, dy - 3)
      doc.fillStroke()
      doc.setTextColor(0, 0, 0)
      doc.text("= Decision / Verificacion", 35, dy + 1)

      // Phase legend
      y += 12
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text("FASES:", 20, y)
      y += 5
      doc.setFont("helvetica", "normal")
      for (const phase of phaseConfig) {
        doc.setFillColor(phase.pdfStroke[0], phase.pdfStroke[1], phase.pdfStroke[2])
        doc.circle(23, y, 2, "F")
        doc.setTextColor(0, 0, 0)
        doc.text(phase.name, 28, y + 1)
        y += 5
      }

      doc.save("diagrama-apertura-operativa.pdf")
    }
  }

  // ── Render each shape ──
  const renderShape = (step: FlowStep, processNumber: number, phaseIdx: number, isEditing: boolean) => {
    const phase = phaseConfig[phaseIdx]

    if (step.shape === "terminator") {
      return (
        <div className="relative flex items-center justify-center w-full">
          <div className="bg-foreground rounded-full px-8 sm:px-12 py-3 sm:py-4 min-w-[200px] sm:min-w-[280px] flex items-center justify-center">
            {isEditing ? (
              <Input
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="text-center bg-transparent border-white/30 text-white font-bold text-sm max-w-[200px]"
                autoFocus
              />
            ) : (
              <span className="text-background font-bold text-sm sm:text-base tracking-wider uppercase text-center">
                {step.label}
              </span>
            )}
          </div>
        </div>
      )
    }

    if (step.shape === "decision") {
      return (
        <div className="relative flex items-center justify-center w-full">
          <div className={`relative w-[180px] h-[90px] sm:w-[240px] sm:h-[120px]`}>
            <svg viewBox="0 0 240 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <polygon
                points="120,4 236,60 120,116 4,60"
                className={`fill-amber-50 stroke-amber-500`}
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center px-10 sm:px-14">
              {isEditing ? (
                <Input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="text-center bg-transparent border-amber-400 text-foreground font-medium text-xs max-w-[130px]"
                  autoFocus
                />
              ) : (
                <span className="font-medium text-xs sm:text-sm text-center leading-tight">
                  <span className="font-bold">{processNumber}.</span> {step.label}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    }

    // Process (rectangle)
    return (
      <div className="w-full max-w-[240px] sm:max-w-[320px] mx-auto">
        <div className={`border-2 ${phase.color} rounded-lg px-4 py-3 flex items-center justify-center min-h-[52px] relative`}>
          <div className={`absolute -top-3 -left-3 w-7 h-7 ${phase.badge} rounded-full flex items-center justify-center`}>
            <span className="text-white text-xs font-bold">{processNumber}</span>
          </div>
          {isEditing ? (
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className={`text-center bg-transparent border-current font-medium text-sm ${phase.textColor}`}
              autoFocus
            />
          ) : (
            <span className={`font-medium text-xs sm:text-sm text-center leading-snug break-words ${phase.textColor}`}>
              {step.label}
            </span>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  // ── MAIN RENDER ──
  let procCounter = 0

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Image src="/logo.png" alt="Los Cochirinos" width={180} height={48} className="h-14 w-auto mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
          Diagrama de Flujo de Apertura Operativa
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {totalProcesses} pasos | Simbologia estandar ISO
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button
          onClick={() => { setShowAddForm(!showAddForm); setNewPosition(totalProcesses + 1) }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" /> Agregar tarea
        </Button>
        <Button variant="outline" onClick={generatePDF} className="gap-2">
          <Download className="w-4 h-4" /> Descargar PDF
        </Button>
      </div>

      {/* Add task form */}
      {showAddForm && (
        <Card className="mb-6 border-dashed border-2 border-primary/40">
          <CardContent className="p-4 space-y-3">
            <p className="font-semibold text-sm">Nueva tarea</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                <Input
                  placeholder="Nombre del paso..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="w-full sm:w-24">
                <label className="text-xs text-muted-foreground mb-1 block">Posicion #</label>
                <Input
                  type="number"
                  min={1}
                  max={totalProcesses + 1}
                  value={newPosition}
                  onChange={(e) => setNewPosition(Number(e.target.value))}
                />
              </div>
              <div className="w-full sm:w-40">
                <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
                <select
                  value={newShape}
                  onChange={(e) => setNewShape(e.target.value as FlowStep["shape"])}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm"
                >
                  <option value="process">Proceso</option>
                  <option value="decision">Decision</option>
                  <option value="terminator">Inicio / Fin</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              La tarea se insertara en la posicion #{newPosition} y las demas se desplazaran hacia abajo.
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={addStep} className="gap-1">
                <Save className="w-3.5 h-3.5" /> Guardar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAddForm(false); setNewLabel(""); setNewShape("process") }}>
                <X className="w-3.5 h-3.5 mr-1" /> Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Simbologia</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-foreground rounded-full" />
                  <span className="text-xs">Inicio / Fin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 bg-green-50 border-2 border-green-600 rounded" />
                  <span className="text-xs">Proceso</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 32 20" className="w-8 h-4">
                    <polygon points="16,1 31,10 16,19 1,10" fill="#FFF7ED" stroke="#F59E0B" strokeWidth="2" />
                  </svg>
                  <span className="text-xs">Decision</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fases</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {phaseConfig.map((p) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${p.badge}`} />
                    <span className="text-xs">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flow diagram */}
      <div className="flex flex-col items-center">
        {steps.map((step, i) => {
          const isEditing = editingId === step.id
          const isTerminator = step.shape === "terminator"
          let processNumber = 0
          let phaseIdx = 0
          if (!isTerminator) {
            procCounter++
            processNumber = procCounter
            phaseIdx = getPhaseIndex(procCounter - 1, totalProcesses)
          }

          return (
            <div key={step.id} className="w-full flex flex-col items-center">
              {/* Step shape */}
              <div className="relative w-full flex flex-col items-center group">
                {renderShape(step, processNumber, phaseIdx, isEditing)}

                {/* Hover action buttons */}
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                  {isEditing ? (
                    <>
                      {!isTerminator && (
                        <select
                          value={editShape}
                          onChange={(e) => setEditShape(e.target.value as FlowStep["shape"])}
                          className="text-xs px-2 py-1 border rounded bg-background"
                        >
                          <option value="process">Proceso</option>
                          <option value="decision">Decision</option>
                          <option value="terminator">Inicio/Fin</option>
                        </select>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600" onClick={() => updateStep(step.id)}>
                        <Save className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingId(null)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-muted-foreground" onClick={() => startEdit(step)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      {!isTerminator && (
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteStep(step.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Arrow */}
              {i < steps.length - 1 && (
                <div className="flex flex-col items-center my-1">
                  <svg width="2" height="24" className="text-muted-foreground">
                    <line x1="1" y1="0" x2="1" y2="18" stroke="currentColor" strokeWidth="2" />
                    <polygon points="-3,18 5,18 1,24" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
