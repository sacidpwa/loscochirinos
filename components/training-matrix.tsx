"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  Users,
  ChefHat,
  Utensils,
  Briefcase,
  Star,
  ArrowLeft,
} from "lucide-react"

interface Area {
  id: number
  name: string
  color: string
  icon: string
}

interface Task {
  id: number
  area_id: number
  name: string
  description: string
  sort_order: number
}

interface Member {
  id: number
  area_id: number
  name: string
  role: string
}

interface Rating {
  id: number
  member_id: number
  task_id: number
  level: number
}

const LEVEL_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  0: { label: "Sin evaluar", color: "text-gray-400", bg: "bg-gray-100" },
  1: { label: "En capacitación", color: "text-amber-600", bg: "bg-amber-100" },
  2: { label: "Buen desempeño", color: "text-blue-600", bg: "bg-blue-100" },
  3: { label: "Experto", color: "text-green-600", bg: "bg-green-100" },
}

const AREA_ICONS: Record<string, React.ReactNode> = {
  cocina: <ChefHat className="w-5 h-5" />,
  servicio: <Utensils className="w-5 h-5" />,
  administracion: <Briefcase className="w-5 h-5" />,
}

export function TrainingMatrix() {
  const [areas, setAreas] = useState<Area[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArea, setSelectedArea] = useState<number>(1)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // New member form
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("")
  const [showAddMember, setShowAddMember] = useState(false)

  // New task form
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskDesc, setNewTaskDesc] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)

  // Edit states
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [areasRes, tasksRes, membersRes, ratingsRes] = await Promise.all([
        fetch("/api/training/areas"),
        fetch("/api/training/tasks"),
        fetch("/api/training/members"),
        fetch("/api/training/ratings"),
      ])
      const [areasData, tasksData, membersData, ratingsData] = await Promise.all([
        areasRes.json(),
        tasksRes.json(),
        membersRes.json(),
        ratingsRes.json(),
      ])
      setAreas(Array.isArray(areasData) ? areasData : [])
      setTasks(Array.isArray(tasksData) ? tasksData : [])
      setMembers(Array.isArray(membersData) ? membersData : [])
      // Convert level to number explicitly
      const parsedRatings = Array.isArray(ratingsData)
        ? ratingsData.map((r: Rating) => ({
            ...r,
            member_id: Number(r.member_id),
            task_id: Number(r.task_id),
            level: Number(r.level),
          }))
        : []
      setRatings(parsedRatings)
    } catch (err) {
      console.error("Error loading training data:", err)
    } finally {
      setLoading(false)
    }
  }

  const addMember = async () => {
    if (!newMemberName.trim()) return
    try {
      await fetch("/api/training/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area_id: selectedArea, name: newMemberName, role: newMemberRole }),
      })
      await loadData()
      setNewMemberName("")
      setNewMemberRole("")
      setShowAddMember(false)
    } catch (err) {
      console.error("Error adding member:", err)
    }
  }

  const updateMember = async () => {
    if (!editingMember) return
    try {
      await fetch("/api/training/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingMember.id, name: editingMember.name, role: editingMember.role }),
      })
      await loadData()
      setEditingMember(null)
    } catch (err) {
      console.error("Error updating member:", err)
    }
  }

  const deleteMember = async (id: number) => {
    if (!confirm("¿Eliminar este integrante?")) return
    try {
      await fetch("/api/training/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await loadData()
      if (selectedMember?.id === id) setSelectedMember(null)
    } catch (err) {
      console.error("Error deleting member:", err)
    }
  }

  const addTask = async () => {
    if (!newTaskName.trim()) return
    try {
      await fetch("/api/training/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area_id: selectedArea, name: newTaskName, description: newTaskDesc }),
      })
      await loadData()
      setNewTaskName("")
      setNewTaskDesc("")
      setShowAddTask(false)
    } catch (err) {
      console.error("Error adding task:", err)
    }
  }

  const updateTask = async () => {
    if (!editingTask) return
    try {
      await fetch("/api/training/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingTask.id, name: editingTask.name, description: editingTask.description }),
      })
      await loadData()
      setEditingTask(null)
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const deleteTask = async (id: number) => {
    if (!confirm("¿Eliminar esta tarea?")) return
    try {
      await fetch("/api/training/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      await loadData()
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  const updateRating = async (memberId: number, taskId: number, level: number) => {
    // Optimistic update - immediately update local state
    setRatings((prev) => {
      const existingIndex = prev.findIndex((r) => r.member_id === memberId && r.task_id === taskId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], level }
        return updated
      } else {
        return [...prev, { id: Date.now(), member_id: memberId, task_id: taskId, level }]
      }
    })
    
    try {
      await fetch("/api/training/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, task_id: taskId, level }),
      })
      // Reload to sync with server
      await loadData()
    } catch (err) {
      console.error("Error updating rating:", err)
      // Reload to revert on error
      await loadData()
    }
  }

  const getRating = (memberId: number, taskId: number): number => {
    const r = ratings.find((r) => r.member_id === memberId && r.task_id === taskId)
    return r?.level ?? 0
  }

  const getAreaMembers = (areaId: number) => members.filter((m) => m.area_id === areaId)
  const getAreaTasks = (areaId: number) => tasks.filter((t) => t.area_id === areaId)

  const currentArea = areas.find((a) => a.id === selectedArea)
  const areaMembers = getAreaMembers(selectedArea)
  const areaTasks = getAreaTasks(selectedArea)

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src="/logo.png" alt="Los Cochirinos" width={120} height={32} className="h-10 w-auto" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Matriz de Capacitación</h1>
            <p className="text-muted-foreground text-sm">Seguimiento de habilidades del equipo</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Area Tabs */}
      <Tabs value={String(selectedArea)} onValueChange={(v) => setSelectedArea(Number(v))}>
        <TabsList className="grid w-full grid-cols-3">
          {areas.map((area) => (
            <TabsTrigger key={area.id} value={String(area.id)} className="gap-2">
              {AREA_ICONS[area.icon] || <Users className="w-4 h-4" />}
              <span className="hidden sm:inline">{area.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {areas.map((area) => (
          <TabsContent key={area.id} value={String(area.id)} className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{getAreaMembers(area.id).length}</p>
                  <p className="text-xs text-muted-foreground">Integrantes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-orange-500">{getAreaTasks(area.id).length}</p>
                  <p className="text-xs text-muted-foreground">Tareas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-green-500">
                    {ratings.filter((r) => {
                      const task = tasks.find((t) => t.id === r.task_id)
                      return task?.area_id === area.id && r.level === 3
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Expertos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-amber-500">
                    {ratings.filter((r) => {
                      const task = tasks.find((t) => t.id === r.task_id)
                      return task?.area_id === area.id && r.level === 1
                    }).length}
                  </p>
                  <p className="text-xs text-muted-foreground">En Capacitación</p>
                </CardContent>
              </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Team Members Column */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" /> Integrantes
                    </CardTitle>
                    <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Integrante a {area.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Input
                            placeholder="Nombre del integrante"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                          />
                          <Input
                            placeholder="Puesto / Rol (opcional)"
                            value={newMemberRole}
                            onChange={(e) => setNewMemberRole(e.target.value)}
                          />
                          <Button onClick={addMember} className="w-full">
                            <Plus className="w-4 h-4 mr-2" /> Agregar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {getAreaMembers(area.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay integrantes. Agrega el primero.
                    </p>
                  ) : (
                    getAreaMembers(area.id).map((member) => (
                      <div
                        key={member.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedMember?.id === member.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedMember(member)}
                      >
                        {editingMember?.id === member.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingMember.name}
                              onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                              autoFocus
                            />
                            <Input
                              value={editingMember.role}
                              onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                              placeholder="Puesto"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={updateMember} className="flex-1">
                                <Save className="w-3 h-3 mr-1" /> Guardar
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingMember(null)}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{member.name}</p>
                              {member.role && <p className="text-xs text-muted-foreground">{member.role}</p>}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingMember(member)
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-500 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteMember(member.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Training Matrix Column */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {selectedMember ? (
                        <span>
                          Capacitación de <span className="text-primary">{selectedMember.name}</span>
                        </span>
                      ) : (
                        "Selecciona un integrante"
                      )}
                    </CardTitle>
                    <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-1" /> Tarea
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Agregar Tarea a {area.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Input
                            placeholder="Nombre de la tarea"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                          />
                          <Input
                            placeholder="Descripción (opcional)"
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                          />
                          <Button onClick={addTask} className="w-full">
                            <Plus className="w-4 h-4 mr-2" /> Agregar Tarea
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedMember ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Selecciona un integrante para ver y editar su capacitación</p>
                    </div>
                  ) : getAreaTasks(area.id).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No hay tareas definidas. Agrega la primera.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Legend */}
                      <div className="flex flex-wrap gap-2 pb-3 border-b mb-4">
                        {[0, 1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`px-2 py-1 rounded text-xs font-medium ${LEVEL_LABELS[level].bg} ${LEVEL_LABELS[level].color}`}
                          >
                            {level === 3 && <Star className="w-3 h-3 inline mr-1" />}
                            {LEVEL_LABELS[level].label}
                          </div>
                        ))}
                      </div>

                      {getAreaTasks(area.id).map((task) => {
                        const currentLevel = getRating(selectedMember.id, task.id)
                        return (
                          <div key={task.id} className="border rounded-lg p-3">
                            {editingTask?.id === task.id ? (
                              <div className="space-y-2">
                                <Input
                                  value={editingTask.name}
                                  onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
                                  autoFocus
                                />
                                <Input
                                  value={editingTask.description}
                                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                  placeholder="Descripción"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={updateTask}>
                                    <Save className="w-3 h-3 mr-1" /> Guardar
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingTask(null)}>
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-medium">{task.name}</p>
                                    {task.description && (
                                      <p className="text-xs text-muted-foreground">{task.description}</p>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6"
                                      onClick={() => setEditingTask(task)}
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-red-500"
                                      onClick={() => deleteTask(task.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {[0, 1, 2, 3].map((level) => (
                                    <button
                                      key={level}
                                      type="button"
                                      onClick={() => updateRating(selectedMember.id, task.id, level)}
                                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                                        currentLevel === level
                                          ? `${LEVEL_LABELS[level].bg} ${LEVEL_LABELS[level].color} ring-2 ring-offset-1 ring-current`
                                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                                      }`}
                                    >
                                      {level === 3 && <Star className="w-3 h-3 inline mr-1" />}
                                      {LEVEL_LABELS[level].label}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
