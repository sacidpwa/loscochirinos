import Image from "next/image"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl">
          <div className="mb-8">
            <Image src="/logo.png" alt="Los Cochirinos" width={200} height={200} className="h-32 w-auto" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
            Análisis de Negocio
            <span className="block text-primary mt-2">Los Cochirinos</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
            Detección de necesidades y estrategia operativa para el establecimiento de cochinita pibil yucateca con
            receta de 3 generaciones.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">Análisis Completo 2025</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
