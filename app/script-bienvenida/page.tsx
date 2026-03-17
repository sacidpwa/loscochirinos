import Image from "next/image"
import { ScriptBienvenida } from "@/components/script-bienvenida"

export const metadata = {
  title: "Script de Bienvenida | Los Cochirinos",
  description: "Propuesta de script de bienvenida para el equipo de Los Cochirinos",
}

export default function ScriptBienvenidaPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Image src="/logo.png" alt="Los Cochirinos" width={140} height={36} className="h-10 w-auto" />
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg font-bold text-foreground">Script de Bienvenida</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ScriptBienvenida />
      </main>
    </div>
  )
}
