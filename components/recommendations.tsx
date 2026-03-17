import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, ShoppingCart, TrendingUp, Users, Award } from "lucide-react"

export function Recommendations() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recomendaciones Estratégicas</h2>
          <p className="text-muted-foreground text-lg mb-12">Áreas de mejora prioritarias</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <CardTitle>Experiencia del Cliente</CardTitle>
                <CardDescription>Retroalimentación objetiva</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <li>• Implementar encuestas digitales</li>
                  <li>• Invitar a publicar opiniones en redes</li>
                  <li>• Atención más impersonal para gestión objetiva</li>
                  <li>• Sistema de reclamaciones y devoluciones</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 text-chart-2 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <CardTitle>Canales de Venta</CardTitle>
                <CardDescription>Expansión digital</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Actualmente: Presencial y delivery por WhatsApp/Messenger.
                </p>
                <p className="text-sm font-semibold">
                  Considerar integración con plataformas (Uber Eats, Didi Food, Rappi).
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 text-chart-3 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <CardTitle>Presencia Digital</CardTitle>
                <CardDescription>Marketing y contenido</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <li>• Invitar foodies y microinfluencers</li>
                  <li>• Historias de carácter orgánico</li>
                  <li>• Contratar community manager</li>
                  <li>• Aumentar interacciones en redes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-4/10 text-chart-4 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <CardTitle>Equipo y Liderazgo</CardTitle>
                <CardDescription>Estructura actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cocina:</span>
                    <span className="font-semibold">Alejandra</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Piso:</span>
                    <span className="font-semibold">Adrián</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Caja:</span>
                    <span className="font-semibold">Edith</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Administración:</span>
                    <span className="font-semibold">Fernanda</span>
                  </div>
                  <p className="text-muted-foreground pt-2 border-t border-border">
                    Prioridad: contratar recurso para cocina (puesto con mayor demanda)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 md:col-span-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-5/10 text-chart-5 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <CardTitle>Capacitación de Personal</CardTitle>
                <CardDescription>Desarrollo de habilidades cruzadas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  En esta etapa de evaluación de viabilidad del proyecto, resulta indispensable que todo el equipo pueda
                  dominar las funciones de todos los perfiles de puesto operativos. Esto garantiza flexibilidad
                  operativa y continuidad del servicio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
