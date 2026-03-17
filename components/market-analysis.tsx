import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketAnalysis() {
  return (
    <section id="mercado" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Análisis de Mercado</h2>
          <p className="text-muted-foreground text-lg mb-12">Contexto competitivo y ubicación estratégica</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">19</CardTitle>
                <CardDescription>Establecimientos sobre carretera</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Alta competencia en la zona principal de tránsito vehicular.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">11</CardTitle>
                <CardDescription>Establecimientos sobre Av. Hidalgo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Penúltima posición en la avenida, requiere estrategia de diferenciación.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
