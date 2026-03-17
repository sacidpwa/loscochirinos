import TodoManager from "@/components/todo-manager"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "To-Do | Los Cochirinos",
  description: "Gestiona las tareas y actividades del proyecto Los Cochirinos",
}

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/logo.png" alt="Los Cochirinos" width={50} height={50} className="rounded-full" />
            </Link>
            <h1 className="text-lg font-bold">To-Do | Los Cochirinos</h1>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Actividades del Proyecto</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona las tareas, asigna responsables y da seguimiento al progreso de cada actividad.
          </p>
        </div>
        <TodoManager />
      </main>
    </div>
  )
}
