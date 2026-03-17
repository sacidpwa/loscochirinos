import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp } from "lucide-react"

export function Objectives() {
  return (
    <section id="objetivos" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Objetivos Generales del Proyecto</h2>
          <p className="text-muted-foreground text-lg mb-12">Metas estratégicas a alcanzar</p>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/50 bg-card">
              <CardHeader>
                <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Meta Financiera</CardTitle>
                <CardDescription>Objetivo de ingresos mensuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-primary mb-4">$400,000</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Establecer un piso de ingreso mensual que garantice la sostenibilidad y rentabilidad del negocio.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/50 bg-card">
              <CardHeader>
                <div className="w-16 h-16 rounded-lg bg-accent/10 text-accent-foreground flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <CardTitle className="text-2xl">Modelo de Crecimiento</CardTitle>
                <CardDescription>Visión de expansión</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold mb-4">Franquicia Escalable</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transición de autoempleo a dueño de negocio con libertad de horario y crecimiento mediante modelo de
                  franquicia para expansión de sucursales.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8 border-2 bg-muted/50">
            <CardHeader>
              <CardTitle>Próximos Pasos Recomendados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Establecer metas para el primer trimestre de 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Implementar planes de ascenso y distribución de utilidades</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Evaluar la viabilidad económica del proyecto en la actual locación</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Establecer plazos y objetivos económicos con retorno de inversión claro</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
