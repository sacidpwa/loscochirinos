import Image from "next/image"
import Link from "next/link"
import { RecipeManager } from "@/components/recipe-manager"

export const metadata = {
  title: "Recetas Estandarizadas | Los Cochirinos",
  description: "Registro y estandarizacion de recetas de Los Cochirinos",
}

export default function RecetasPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Los Cochirinos" width={140} height={38} className="h-10 w-auto" />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Volver al inicio
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <RecipeManager />
      </main>
    </div>
  )
}
