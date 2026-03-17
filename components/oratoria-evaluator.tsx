"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Trash2, Download, Plus, Award, Mic, Sparkles, FileText } from "lucide-react"
import { jsPDF } from "jspdf"

interface Evaluation {
  id: number
  participant_name: string
  diccion: number
  ritmo: number
  entonacion: number
  intensidad: number
  expresion_corporal: number
  dominio_escenico: number
  conexion_emocional: number
  introduccion: number
  desarrollo: number
  conclusion: number
  total_score: number
  notes: string
  created_at: string
}

interface Criterion {
  key: string
  name: string
  description: string
}

const CRITERIA_TECNICA: Criterion[] = [
  { key: "diccion", name: "Diccion", description: "Claridad y pronunciacion" },
  { key: "ritmo", name: "Ritmo", description: "Velocidad y pausas" },
  { key: "entonacion", name: "Entonacion", description: "Variacion melodica" },
  { key: "intensidad", name: "Intensidad", description: "Volumen y proyeccion" },
]

const CRITERIA_EXPRESION: Criterion[] = [
  { key: "expresion_corporal", name: "Expresion Corporal", description: "Gestual y movimiento" },
  { key: "dominio_escenico", name: "Dominio Escenico", description: "Seguridad en escena" },
  { key: "conexion_emocional", name: "Conexion Emocional", description: "Autenticidad" },
]

const CRITERIA_ESTRUCTURA: Criterion[] = [
  { key: "introduccion", name: "Introduccion", description: "Captar atencion" },
  { key: "desarrollo", name: "Desarrollo", description: "Ideas claras y ordenadas" },
  { key: "conclusion", name: "Conclusion", description: "Mensaje memorable" },
]

export default function OratoriaEvaluator() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [participantName, setParticipantName] = useState("")
  const [notes, setNotes] = useState("")
  const [scores, setScores] = useState<Record<string, number>>({
    diccion: 5,
    ritmo: 5,
    entonacion: 5,
    intensidad: 5,
    expresion_corporal: 5,
    dominio_escenico: 5,
    conexion_emocional: 5,
    introduccion: 5,
    desarrollo: 5,
    conclusion: 5,
  })
  const [showResult, setShowResult] = useState(false)

  const loadEvaluations = useCallback(async () => {
    try {
      const res = await fetch("/api/oratoria")
      const data = await res.json()
      setEvaluations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading evaluations:", error)
      setEvaluations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvaluations()
  }, [loadEvaluations])

  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0)

  const getScoreMessage = (score: number) => {
    const percentage = (score / 100) * 100
    if (percentage >= 90) return { text: "Excepcional!", color: "text-yellow-500" }
    if (percentage >= 80) return { text: "Muy Bueno", color: "text-green-500" }
    if (percentage >= 70) return { text: "Bueno", color: "text-blue-500" }
    if (percentage >= 60) return { text: "Regular", color: "text-orange-500" }
    return { text: "Puede Mejorar", color: "text-red-500" }
  }

  const saveEvaluation = async () => {
    if (!participantName.trim()) {
      alert("Por favor ingresa el nombre de la participante")
      return
    }

    try {
      await fetch("/api/oratoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_name: participantName,
          ...scores,
          total_score: totalScore,
          notes,
        }),
      })
      await loadEvaluations()
      resetForm()
      alert(`Evaluacion de ${participantName} guardada exitosamente!`)
    } catch (error) {
      console.error("Error saving evaluation:", error)
    }
  }

  const deleteEvaluation = async (id: number) => {
    if (!confirm("Eliminar esta evaluacion?")) return
    try {
      await fetch("/api/oratoria", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await loadEvaluations()
    } catch (error) {
      console.error("Error deleting evaluation:", error)
    }
  }

  const resetForm = () => {
    setParticipantName("")
    setNotes("")
    setScores({
      diccion: 5,
      ritmo: 5,
      entonacion: 5,
      intensidad: 5,
      expresion_corporal: 5,
      dominio_escenico: 5,
      conexion_emocional: 5,
      introduccion: 5,
      desarrollo: 5,
      conclusion: 5,
    })
    setShowResult(false)
  }

  const generatePDF = async () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()

    // Header gradient effect
    pdf.setFillColor(102, 126, 234)
    pdf.rect(0, 0, pageWidth, 45, "F")

    // Title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(22)
    pdf.setFont("helvetica", "bold")
    pdf.text("Evaluador de Oratoria", pageWidth / 2, 20, { align: "center" })
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text("Certamen de Belleza - Resultados Finales", pageWidth / 2, 32, { align: "center" })

    let y = 60

    // Date
    pdf.setTextColor(100, 100, 100)
    pdf.setFontSize(10)
    pdf.text(`Fecha de generacion: ${new Date().toLocaleDateString("es-MX")}`, 15, y)
    y += 15

    // Rankings
    pdf.setTextColor(102, 126, 234)
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text("Ranking de Participantes", 15, y)
    y += 10

    // Table header
    pdf.setFillColor(240, 240, 240)
    pdf.rect(15, y, pageWidth - 30, 10, "F")
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Pos.", 20, y + 7)
    pdf.text("Participante", 40, y + 7)
    pdf.text("Puntaje", pageWidth - 40, y + 7)
    y += 15

    // Table rows
    pdf.setFont("helvetica", "normal")
    evaluations.forEach((ev, index) => {
      if (y > 270) {
        pdf.addPage()
        y = 20
      }

      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 250)
        pdf.rect(15, y - 5, pageWidth - 30, 10, "F")
      }

      pdf.setTextColor(50, 50, 50)
      pdf.text(`${index + 1}`, 20, y + 2)
      pdf.text(ev.participant_name, 40, y + 2)

      // Score badge color
      if (ev.total_score >= 90) pdf.setTextColor(234, 179, 8)
      else if (ev.total_score >= 80) pdf.setTextColor(34, 197, 94)
      else if (ev.total_score >= 70) pdf.setTextColor(59, 130, 246)
      else pdf.setTextColor(249, 115, 22)

      pdf.setFont("helvetica", "bold")
      pdf.text(`${ev.total_score}/100`, pageWidth - 40, y + 2)
      pdf.setFont("helvetica", "normal")
      y += 12
    })

    y += 10

    // Detailed scores for top 3
    if (evaluations.length > 0) {
      pdf.addPage()
      y = 20

      pdf.setTextColor(102, 126, 234)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("Desglose de Calificaciones - Top 3", 15, y)
      y += 15

      const top3 = evaluations.slice(0, 3)
      for (const ev of top3) {
        if (y > 240) {
          pdf.addPage()
          y = 20
        }

        pdf.setFillColor(102, 126, 234)
        pdf.rect(15, y, pageWidth - 30, 10, "F")
        pdf.setTextColor(255, 255, 255)
        pdf.setFontSize(12)
        pdf.text(`${ev.participant_name} - ${ev.total_score}/100`, 20, y + 7)
        y += 15

        pdf.setTextColor(80, 80, 80)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "normal")

        const criteriaList = [
          { name: "Diccion", value: ev.diccion },
          { name: "Ritmo", value: ev.ritmo },
          { name: "Entonacion", value: ev.entonacion },
          { name: "Intensidad", value: ev.intensidad },
          { name: "Expresion Corporal", value: ev.expresion_corporal },
          { name: "Dominio Escenico", value: ev.dominio_escenico },
          { name: "Conexion Emocional", value: ev.conexion_emocional },
          { name: "Introduccion", value: ev.introduccion },
          { name: "Desarrollo", value: ev.desarrollo },
          { name: "Conclusion", value: ev.conclusion },
        ]

        criteriaList.forEach((c, i) => {
          const col = i < 5 ? 0 : 1
          const row = i < 5 ? i : i - 5
          const xPos = col === 0 ? 20 : pageWidth / 2 + 10
          const yPos = y + row * 8
          pdf.text(`${c.name}: ${c.value}/10`, xPos, yPos)
        })

        y += 45

        if (ev.notes) {
          pdf.setFontSize(9)
          pdf.setTextColor(100, 100, 100)
          pdf.text(`Notas: ${ev.notes.substring(0, 100)}${ev.notes.length > 100 ? "..." : ""}`, 20, y)
          y += 10
        }

        y += 10
      }
    }

    // Footer
    pdf.setTextColor(150, 150, 150)
    pdf.setFontSize(8)
    pdf.text("Generado por Evaluador de Oratoria - Los Cochirinos", pageWidth / 2, 285, { align: "center" })

    pdf.save("resultados-oratoria.pdf")
  }

  const renderCriterionSlider = (criterion: Criterion) => (
    <div key={criterion.key} className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-semibold text-foreground">{criterion.name}</span>
          <span className="text-sm text-muted-foreground ml-2">({criterion.description})</span>
        </div>
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full font-bold text-sm">
          {scores[criterion.key]}
        </span>
      </div>
      <Slider
        value={[scores[criterion.key]]}
        onValueChange={(value) => setScores((prev) => ({ ...prev, [criterion.key]: value[0] }))}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-8 text-white text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Mic className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Evaluador de Oratoria</h1>
        </div>
        <p className="opacity-90">Certamen de Belleza - Jurado de Expresion Verbal</p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <label className="block font-semibold text-foreground mb-2">Nombre de la Participante</label>
            <Input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Ej: Maria Gonzalez"
              className="text-lg"
            />
          </div>

          {/* Aspectos Tecnicos */}
          <div className="bg-muted/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-6 border-b border-purple-300 pb-3">
              <FileText className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-purple-600">Aspectos Tecnicos de la Oratoria</h3>
            </div>
            {CRITERIA_TECNICA.map(renderCriterionSlider)}
          </div>

          {/* Expresion Corporal */}
          <div className="bg-muted/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-6 border-b border-pink-300 pb-3">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-bold text-pink-600">Expresion Corporal y Escenica</h3>
            </div>
            {CRITERIA_EXPRESION.map(renderCriterionSlider)}
          </div>

          {/* Estructura */}
          <div className="bg-muted/50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-6 border-b border-indigo-300 pb-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-indigo-600">Estructura del Discurso</h3>
            </div>
            {CRITERIA_ESTRUCTURA.map(renderCriterionSlider)}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block font-semibold text-foreground mb-2">Observaciones / Comentarios</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe aqui tus observaciones sobre esta participante..."
              className="w-full p-4 border rounded-xl min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowResult(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Calcular Puntaje
            </Button>
            <Button
              onClick={saveEvaluation}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" /> Guardar Evaluacion
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Nueva Evaluacion
            </Button>
            <Button variant="outline" onClick={generatePDF} disabled={evaluations.length === 0}>
              <Download className="w-4 h-4 mr-2" /> Exportar PDF
            </Button>
          </div>

          {/* Result */}
          {showResult && (
            <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white text-center">
              <p className="text-sm opacity-90 mb-2">PUNTAJE TOTAL</p>
              <p className="text-5xl font-bold mb-2">{totalScore}/100</p>
              <p className={`text-lg font-semibold ${getScoreMessage(totalScore).color}`}>
                {getScoreMessage(totalScore).text}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Award className="w-5 h-5" /> Participantes Evaluadas ({evaluations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {evaluations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay evaluaciones guardadas aun</p>
          ) : (
            <div className="space-y-3">
              {evaluations.map((ev, index) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between bg-muted/50 rounded-xl p-4 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-purple-600 w-8">{index + 1}</span>
                    <div>
                      <h4 className="font-semibold">{ev.participant_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ev.created_at).toLocaleDateString("es-MX")}
                        {ev.notes && " - Tiene observaciones"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold">
                      {ev.total_score}/100
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteEvaluation(ev.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
