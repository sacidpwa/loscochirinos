import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function FinancialAnalysis() {
  return (
    <section id="financiero" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Análisis Financiero</h2>
          <p className="text-muted-foreground text-lg mb-12">Costos, punto de equilibrio y viabilidad</p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Costos Fijos</CardTitle>
                <CardDescription>Relación con ingresos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">37%</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  De los ingresos totales, manteniendo una estructura eficiente.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Costos Variables</CardTitle>
                <CardDescription>Por encima de utilidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive mb-2">+18%</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Superan el margen de utilidad actual, indicando necesidad de optimización.
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert className="mb-8 border-destructive/50 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              El negocio aún no alcanza el punto de equilibrio ya que no sustenta los sueldos de dos integrantes del
              equipo.
            </AlertDescription>
          </Alert>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Punto de Equilibrio</CardTitle>
              <CardDescription>Metas mensuales requeridas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Ingresos Mínimos</div>
                  <div className="text-2xl font-bold text-primary">$146,500</div>
                  <div className="text-sm text-muted-foreground mt-1">mensuales</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Unidades de Consumo</div>
                  <div className="text-2xl font-bold text-primary">1,628</div>
                  <div className="text-sm text-muted-foreground mt-1">mensuales</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Comensales Diarios</div>
                    <div className="text-2xl font-bold">63</div>
                    <div className="text-xs text-muted-foreground mt-1">para punto de equilibrio</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Consumo Máximo</div>
                    <div className="text-2xl font-bold">17</div>
                    <div className="text-xs text-muted-foreground mt-1">diarios / 425 mensuales</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
