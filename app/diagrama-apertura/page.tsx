import Image from "next/image"
import { FlowDiagram } from "@/components/flow-diagram"

export const metadata = {
  title: "Diagrama de Flujo - Apertura Operativa | Los Cochirinos",
  description: "Diagrama de flujo del proceso de apertura operativa de Los Cochirinos",
}

export default function DiagramaAperturaPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0]">
      <header className="bg-[#1a1a1a] py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Image src="/logo.png" alt="Los Cochirinos" width={160} height={42} className="h-10 w-auto" />
          <a
            href="/"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <FlowDiagram />
      </main>
    </div>
  )
}
