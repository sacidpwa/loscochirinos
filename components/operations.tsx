import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, Users, Utensils, AlertTriangle } from "lucide-react"

export function Operations() {
  return (
    <section id="operaciones" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Operaciones</h2>
          <p className="text-muted-foreground text-lg mb-12">Capacidad instalada y optimización de procesos</p>

          <div className="space-y-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horarios de Operación
                </CardTitle>
                <CardDescription>Ajuste recomendado según flujo de clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-md font-semibold text-sm">9:00 AM</div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Iniciar operación desde temprano, incluyendo menú de desayuno (chilaquiles, huevos, molletes).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-md font-semibold text-sm">
                    12:00 PM
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Especialidades de mayor volumen (pizza mestiza, pasta con cochinita, tacos ahogados).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-primary/50 bg-primary/5">
              <Utensils className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Capacidad Actual</AlertTitle>
              <AlertDescription className="text-primary/90 mt-2">
                <div className="space-y-2">
                  <p>• Capacidad: 4 personas en 15 minutos</p>
                  <p>• Tiempo de reciclaje: 20-30 minutos (5ta persona en adelante)</p>
                  <p>• Leaptime: 4 min/menaje, 8 min/especialidad</p>
                  <p>• Instalación: 6 mesas sin estacionamiento</p>
                </div>
              </AlertDescription>
            </Alert>

            <Card className="border-2 border-chart-3/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-chart-3" />
                  Recomendación de Personal
                </CardTitle>
                <CardDescription>Para alcanzar punto de equilibrio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-chart-3 mb-1">2</div>
                    <div className="text-sm text-muted-foreground">Ensambladores</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-chart-3 mb-1">1</div>
                    <div className="text-sm text-muted-foreground">Runner</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-chart-3 mb-1">2</div>
                    <div className="text-sm text-muted-foreground">Estaciones</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertTitle className="text-destructive">Proveedor Crítico</AlertTitle>
              <AlertDescription className="text-destructive/90 mt-2">
                <p className="mb-2">
                  El único proveedor clave es la persona que realiza la producción de cochinita como insumo primario.
                </p>
                <p className="font-semibold">
                  Es primordial contemplar métodos de sustitución para garantizar la operación continua del negocio.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  )
}
