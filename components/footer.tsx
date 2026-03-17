export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="text-xl font-bold text-primary mb-2">Los Cochirinos</div>
              <p className="text-sm text-muted-foreground">Análisis de Negocio 2025</p>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>Cochinita Pibil Yucateca</p>
              <p>Receta de 3 Generaciones</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
