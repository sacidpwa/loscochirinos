"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, Pencil, Save } from "lucide-react"
import Image from "next/image"

interface Task {
  id: number
  name: string
  percentage: number
  responsible: string
  created_at: string
  updated_at: string
}

export default function TodoManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ name: "", percentage: 0, responsible: "" })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNames, setEditingNames] = useState<Record<number, boolean>>({})
  const [localValues, setLocalValues] = useState<Record<string, Record<string, string>>>({})
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error loading tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.name.trim()) return
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      })
      await loadTasks()
      setNewTask({ name: "", percentage: 0, responsible: "" })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const updateTask = useCallback(async (task: Task, field: string, value: string | number) => {
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: task.id,
          name: field === "name" ? value : task.name,
          percentage: field === "percentage" ? Number(value) : task.percentage,
          responsible: field === "responsible" ? value : task.responsible,
        }),
      })
      await loadTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }, [])

  const deleteTask = async (id: number) => {
    try {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await loadTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const getLocalValue = (taskId: number, field: string, original: string) => {
    return localValues[taskId]?.[field] ?? original
  }

  const handleLocalChange = (task: Task, field: string, value: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [task.id]: { ...prev[task.id], [field]: value },
    }))

    const timerKey = `${task.id}-${field}`
    if (debounceTimers.current[timerKey]) {
      clearTimeout(debounceTimers.current[timerKey])
    }
    debounceTimers.current[timerKey] = setTimeout(() => {
      updateTask(task, field, value)
      setLocalValues((prev) => {
        const copy = { ...prev }
        if (copy[task.id]) {
          delete copy[task.id][field]
          if (Object.keys(copy[task.id]).length === 0) delete copy[task.id]
        }
        return copy
      })
    }, 800)
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle2 className="h-5 w-5 text-green-600" />
    if (percentage >= 50) return <Clock className="h-5 w-5 text-amber-500" />
    return <AlertCircle className="h-5 w-5 text-red-500" />
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500"
    if (percentage >= 75) return "bg-emerald-500"
    if (percentage >= 50) return "bg-amber-500"
    if (percentage >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => Number(t.percentage) >= 100).length
  const averageProgress = totalTasks > 0 ? Math.round(tasks.reduce((sum, t) => sum + Number(t.percentage), 0) / totalTasks) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de tareas</CardDescription>
            <CardTitle className="text-4xl">{totalTasks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tareas completadas</CardDescription>
            <CardTitle className="text-4xl text-green-600">{completedTasks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progreso promedio</CardDescription>
            <CardTitle className="text-4xl">{averageProgress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${getProgressColor(averageProgress)}`}
                style={{ width: `${Math.min(averageProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Lista de Actividades</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Tarea
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Nombre de la tarea</label>
                <Input
                  placeholder="Descripcion de la tarea..."
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Responsable</label>
                <Input
                  placeholder="Nombre del responsable..."
                  value={newTask.responsible}
                  onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addTask} className="flex-1">Guardar</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No hay tareas registradas. Agrega una nueva tarea para comenzar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const pct = Number(getLocalValue(task.id, "percentage", String(task.percentage)))
            const isEditingName = editingNames[task.id] || false
            return (
              <Card key={task.id} className={pct >= 100 ? "border-green-300 bg-green-50" : ""}>
                <CardContent className="p-4">
                  {/* Task name row */}
                  <div className="flex items-start gap-2 mb-3">
                    {getStatusIcon(pct)}
                    <div className="flex-1 min-w-0">
                      {isEditingName ? (
                        <textarea
                          className="w-full font-semibold text-base border rounded-md px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                          value={getLocalValue(task.id, "name", task.name || "")}
                          onChange={(e) => {
                            setLocalValues((prev) => ({
                              ...prev,
                              [task.id]: { ...prev[task.id], name: e.target.value },
                            }))
                          }}
                          rows={2}
                          autoFocus
                        />
                      ) : (
                        <p className="font-semibold text-base leading-snug break-words whitespace-pre-wrap">
                          {getLocalValue(task.id, "name", task.name || "")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditingName ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={() => {
                            const newName = getLocalValue(task.id, "name", task.name || "")
                            updateTask(task, "name", newName)
                            setLocalValues((prev) => {
                              const copy = { ...prev }
                              if (copy[task.id]) {
                                delete copy[task.id].name
                                if (Object.keys(copy[task.id]).length === 0) delete copy[task.id]
                              }
                              return copy
                            })
                            setEditingNames((prev) => ({ ...prev, [task.id]: false }))
                          }}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditingNames((prev) => ({ ...prev, [task.id]: true }))}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-5 mb-3">
                    <div
                      className={`h-5 rounded-full transition-all flex items-center justify-center text-xs font-bold text-white ${getProgressColor(pct)}`}
                      style={{ width: `${Math.min(Math.max(pct, 12), 100)}%` }}
                    >
                      {pct}%
                    </div>
                  </div>
                  {/* Percentage and responsible */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Progreso:</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        className="w-20 text-center"
                        value={getLocalValue(task.id, "percentage", String(task.percentage ?? 0))}
                        onChange={(e) => handleLocalChange(task, "percentage", e.target.value)}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Responsable:</label>
                      <Input
                        className="flex-1"
                        value={getLocalValue(task.id, "responsible", task.responsible || "")}
                        onChange={(e) => handleLocalChange(task, "responsible", e.target.value)}
                        placeholder="Asignar responsable"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
