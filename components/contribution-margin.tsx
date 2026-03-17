import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ContributionMargin() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Margen de Contribución</h2>
          <p className="text-muted-foreground text-lg mb-12">Rentabilidad por producto</p>

          <div className="space-y-6">
            <Card className="border-2 border-chart-1/50 bg-chart-1/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Puerkamix</span>
                  <span className="text-3xl text-chart-1">64.21%</span>
                </CardTitle>
                <CardDescription>Mayor margen de contribución</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La mezcla de dos carnes aumenta significativamente el valor percibido, generando el mejor margen del
                  menú.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-chart-2/50 bg-chart-2/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cochimix</span>
                  <span className="text-3xl text-chart-2">54.45%</span>
                </CardTitle>
                <CardDescription>Segundo mejor margen</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Combinación de carnes que mantiene alto valor percibido con buena rentabilidad.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cochirino Original</span>
                    <span className="text-2xl text-destructive">19.91%</span>
                  </CardTitle>
                  <CardDescription>Menor margen</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Producto con el margen más bajo del menú.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Cochirina</span>
                    <span className="text-2xl">23.50%</span>
                  </CardTitle>
                  <CardDescription>Margen bajo con alto valor percibido</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A pesar del bajo margen, el tamaño, sofisticación y mezcla de ingredientes generan alto valor
                    percibido.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
