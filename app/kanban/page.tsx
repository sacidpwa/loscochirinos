import { KanbanManager } from "@/components/kanban-manager"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Kanban - Los Cochirinos",
  description: "Gestión de inventario y órdenes de compra",
}

export default function KanbanPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Los Cochirinos" width={180} height={48} className="h-12 w-auto" />
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Volver al Inicio
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <KanbanManager />
      </main>
    </div>
  )
}
