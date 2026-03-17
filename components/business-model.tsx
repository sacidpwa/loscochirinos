import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, DollarSign } from "lucide-react"

export function BusinessModel() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Modelo de Negocio</h2>
          <p className="text-muted-foreground text-lg mb-12">Propuesta de valor y segmento objetivo</p>

          <Card className="border-2 bg-card mb-8">
            <CardHeader>
              <CardTitle>Propuesta de Cocina Rápida</CardTitle>
              <CardDescription>Diferenciadores clave del negocio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Tiempo de Atención</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Máximo 12 minutos por mesa, garantizando servicio rápido sin comprometer calidad.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 text-accent-foreground">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Segmento Objetivo</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Clientes B- y B+ con ticket promedio de $220 pesos por persona.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-chart-2/10 text-chart-2">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Valores Diferenciales</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Excelentes ingredientes, receta yucateca de 3 generaciones, y combinaciones únicas de cochinita
                    pibil.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
