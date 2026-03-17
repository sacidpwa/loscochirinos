import { SuppliersDirectory } from "@/components/suppliers-directory"

export const metadata = {
  title: "Proveedores | Los Cochirinos",
  description: "Directorio y evaluación de proveedores de Los Cochirinos",
}

export default function ProveedoresPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <SuppliersDirectory />
      </div>
    </main>
  )
}
