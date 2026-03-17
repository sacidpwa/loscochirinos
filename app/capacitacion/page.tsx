import { TrainingMatrix } from "@/components/training-matrix"

export const metadata = {
  title: "Matriz de Capacitación | Los Cochirinos",
  description: "Sistema de seguimiento de capacitación del equipo de Los Cochirinos",
}

export default function CapacitacionPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <TrainingMatrix />
      </div>
    </main>
  )
}
